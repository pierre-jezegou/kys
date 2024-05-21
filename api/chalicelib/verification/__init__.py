import os
import boto3
from chalice import Blueprint, NotFoundError
from chalicelib.models.session import SessionRepository, Session, SessionState

APP_BUCKET_NAME = os.environ["APP_BUCKET_NAME"]

bp = Blueprint(__name__)

session_respository = SessionRepository()

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
        session_respository.update_session_state(session_id, "selfie-submitted")
    session = session_respository.get_session(session_id)
    if not session:
        raise NotFoundError("Session not found.")
    selfie_object_name = f"{session_id}/selfie"
    student_id_object_name = f"{session_id}/student-id"
    selfie_faces, error = detect_faces(selfie_object_name)
    if error:
        session_respository.update_session_state(session_id, error)
        return
    student_id_faces, error = detect_faces(student_id_object_name)
    if error:
        session_respository.update_session_state(session_id, error)
        return
    if selfie_faces != 1 or student_id_faces != 1:
        session_respository.update_session_state(session_id, "more-than-one-face")
        return
    text_matches = image_contains_texts(
        student_id_object_name,
        [session["name"], session["university"]],
    )
    if not text_matches:
        session_respository.update_session_state(session_id, "text-not-matched")
        return
    faces_match = compare_faces(selfie_object_name, student_id_object_name)
    if not faces_match:
        session_respository.update_session_state(session_id, "faces-not-matched")
        return
    session_respository.update_session_state(session_id, "approved")
