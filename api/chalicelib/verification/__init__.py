import os
import boto3
import json
import requests
from chalice import Blueprint, Response
from chalicelib.db import get_db

APP_BUCKET_NAME = os.environ["APP_BUCKET_NAME"]
APP_TABLE_STREAM_ARN = os.environ["APP_TABLE_STREAM_ARN"]
APP_SLACK_WEBHOOK_URL = os.environ["APP_SLACK_WEBHOOK_URL"]

DENIED_STATES = [
    "face-not-detected",
    "too-many-faces",
    "faces-not-matched",
    "text-not-detected",
    "text-not-matched",
]

bp = Blueprint(__name__)


def compare_faces(source_object_name, target_object_name, threshold=90):
    rekognition_client = boto3.client("rekognition")

    response = rekognition_client.compare_faces(
        SourceImage={
            "S3Object": {"Bucket": APP_BUCKET_NAME, "Name": source_object_name}
        },
        TargetImage={
            "S3Object": {"Bucket": APP_BUCKET_NAME, "Name": target_object_name}
        },
    )

    return (
            len(response["FaceMatches"]) == 1
            and len(response["UnmatchedFaces"]) == 0
            and response["FaceMatches"][0]["Similarity"] > threshold
    )


def detect_faces(object_name):
    rekognition_client = boto3.client("rekognition")

    try:
        response = rekognition_client.detect_faces(
            Image={
                "S3Object": {
                    "Bucket": APP_BUCKET_NAME,
                    "Name": object_name,
                }
            },
            Attributes=["ALL"]
        )
    except rekognition_client.exceptions.InvalidImageFormatException as e:
        print(f"Invalid image format for {object_name}: {e}")
        return None, "invalid-image-format"
    except Exception as e:
        print(f"Error detecting faces: {e}")
        return None, f"error-detecting-faces: {e}"

    return len(response["FaceDetails"]), None


def needles_in_haystack(needles, haystack):
    for needle in needles:
        for text in haystack["TextDetections"]:
            if needle in text["DetectedText"] and text["Type"] == "LINE":
                break
        else:
            return False

    return True


def image_contains_texts(object_name, texts):
    rekognition_client = boto3.client("rekognition")

    response = rekognition_client.detect_text(
        Image={
            "S3Object": {
                "Bucket": APP_BUCKET_NAME,
                "Name": object_name,
            }
        }
    )

    return needles_in_haystack(texts, response)


@bp.on_s3_event(bucket=APP_BUCKET_NAME, events=["s3:ObjectCreated:*"])
def handle_s3_event(event):
    print(f"Received S3 event: {event}")

    session_id, file = event.key.split("/")

    if file not in ["selfie", "student-id"]:
        return

    print(f"Processing file: {file} for session: {session_id}")

    if file == "selfie":
        # Update the session state, state = selfie-submitted
        get_db().update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": "selfie-submitted"},
        )

    #
    session = get_db().get_item(Key={"id": session_id})["Item"]

    selfie_object_name = f"{session_id}/selfie"
    student_id_object_name = f"{session_id}/student-id"

    selfie_faces, error = detect_faces(selfie_object_name)
    if error:
        get_db().update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": "error-detecting-selfie-faces"},
        )
        return

    student_id_faces, error = detect_faces(student_id_object_name)
    if error:
        get_db().update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": "error-detecting-student-id-faces"},
        )
        return

    if selfie_faces != 1 or student_id_faces != 1:
        # Update the session state, state = more-than-one-face
        get_db().update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": "more-than-one-face"},
        )
        return

    # Check if text matches
    text_matches = image_contains_texts(
        student_id_object_name,
        [
            session["name"],
            session["university"],
        ],
    )

    if not text_matches:
        # Update the session state, state = text-not-matched
        get_db().update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": "text-not-matched"},
        )
        return

    # Check if faces match

    faces_match = compare_faces(
        selfie_object_name,
        student_id_object_name,
    )

    if not faces_match:
        # Update the session state, state = faces-not-matched
        get_db().update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": "faces-not-matched"},
        )
        return

    # Update the session state, state = approved
    get_db().update_item(
        Key={"id": session_id},
        UpdateExpression="SET #state = :state",
        ExpressionAttributeNames={"#state": "state"},
        ExpressionAttributeValues={":state": "approved"},
    )


def generate_presigned_url(session_id, file):
    client = boto3.client("s3")

    presigned_url = client.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": os.environ["APP_BUCKET_NAME"],
            "Key": f"{session_id}/{file}",
        },
        ExpiresIn=3600,  # 1 hour
    )

    return presigned_url


@bp.on_dynamodb_record(stream_arn=APP_TABLE_STREAM_ARN)
def handle_dynamodb_record(event):
    for record in event:
        print("Received record: " + str(record))
        if record.event_name == 'MODIFY':
            new_image = record.new_image
            status = new_image['state']['S']

            if status in DENIED_STATES:
                user_id = new_image['id']['S']
                name = new_image['name']['S']
                university = new_image['university']['S']

                selfie_url = generate_presigned_url(user_id, 'selfie')
                document_url = generate_presigned_url(user_id, 'student-id')

                # Construct Slack message
                message = {
                    "blocks": [
                        {
                            "type": "header",
                            "text": {
                                "type": "plain_text",
                                "text": f"Manual verification required for user: {user_id}"
                            }
                        },
                        {
                            "type": "context",
                            "elements": [
                                {
                                    "type": "plain_text",
                                    "text": f"Name: {name}"
                                }
                            ]
                        },
                        {
                            "type": "context",
                            "elements": [
                                {
                                    "type": "plain_text",
                                    "text": f"University: {university}",
                                }
                            ]
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "image",
                            "title": {
                                "type": "plain_text",
                                "text": "Selfie",
                            },
                            "image_url": selfie_url,
                            "alt_text": "selfie"
                        },
                        {
                            "type": "image",
                            "title": {
                                "type": "plain_text",
                                "text": "Document",
                            },
                            "image_url": document_url,
                            "alt_text": "student_document"
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Approve",
                                    },
                                    "style": "primary",
                                    "value": "approved",
                                    "action_id": "approved"
                                },
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Deny",
                                    },
                                    "style": "danger",
                                    "value": "denied",
                                    "action_id": "denied"
                                }
                            ]
                        }
                    ]
                }

                response = requests.post(
                    APP_SLACK_WEBHOOK_URL, json=message,
                    headers={'Content-Type': 'application/json'}
                )
