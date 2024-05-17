import datetime
import os
import uuid
from typing import Literal

import boto3
from boto3.dynamodb.conditions import Attr
from chalice import BadRequestError, Blueprint, NotFoundError, Rate
from chalicelib.models.session import SessionRepository, SessionState, Session

bp = Blueprint(__name__)

session_repository = SessionRepository()


@bp.route(
    "/",
    methods=["POST"],
    content_types=["application/json"],
    cors=True,
)
def create_session():
    """
    Creates a new verification session.
    """

    body = bp.current_request.json_body

    name = body.get("name")
    if not name:
        raise BadRequestError("`name` is a required field.")

    university = body.get("university")
    if not university:
        raise BadRequestError("`university` is a required field.")

    item = session_repository.add_session(name, university)
    # id = str(uuid.uuid4())
    # state = "pending"
    # created = datetime.datetime.now().isoformat()

    # get_db().put_item(
    #     Item={
    #         "id": id,
    #         "name": name,
    #         "university": university,
    #         "state": state,
    #         "created": created,
    #         "updated": created,
    #     }
    # )
    return {"sessionId": item.get("id")}


@bp.route(
    "/{session_id}",
    methods=["GET"],
    content_types=["application/json"],
    cors=True,
)
def get_session(session_id: str):
    """
    Returns a verification session.
    """
    session = session_repository.get_session(session_id)
    # session = get_db().get_item(Key={"id": session_id}).get("Item")

    if not session:
        raise NotFoundError("Session not found.")

    return session

@bp.route(
    "/audit",
    methods=["GET"],
    content_types=["application/json"],
    cors=True,
)
def get_sessions():
    """
    Returns all verification sessions.
    """

    # sessions = get_db().scan().get("Items")
    sessions = session_repository.list_all_sessions()
    return sessions

@bp.route(
    "/{session_id}/presigned-url/{file}",
    methods=["POST"],
    content_types=["application/json"],
    cors=True,
)
def create_presigned_url(session_id: str, file: str):
    """
    Creates a presigned URL for a verification session.
    """

    if file not in ["selfie", "student-id"]:
        raise BadRequestError("`file` must be either `selfie` or `student-id`.")

    body = bp.current_request.json_body

    content_type = body.get("contentType")
    if not content_type:
        raise BadRequestError("`contentType` is a required field.")

    client = boto3.client("s3")

    presigned_url = client.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": os.environ["APP_BUCKET_NAME"],
            "Key": f"{session_id}/{file}",
            "ContentType": content_type,
        },
        ExpiresIn=3600,  # 1 hour
        HttpMethod="PUT",
    )

    return {"presignedUrl": presigned_url}


@bp.schedule(Rate(7, unit=Rate.DAYS))
def clean_expired_sessions():
    """
    Cleans expired verification sessions.
    """
    cleanup_before = datetime.datetime.now() - datetime.timedelta(days=1)
    sessions = session_repository.list_all_sessions()
    filter_expression=(Attr('state').ne('approved')) & (Attr('created').lt(cleanup_before.isoformat()))
    sessions = session_repository.list_all_sessions(filter_expression)
    # sessions = get_db().scan(
    #     FilterExpression=(Attr('state').ne('approved')) & (Attr('created').lt(cleanup_before.isoformat()))
    # ).get('Items')

    session_ids = [session['id'] for session in sessions]
    if not session_ids:
        return []

    delete_session_images(session_ids)
    delete_sessions(session_ids)
    return session_ids


def delete_sessions(session_ids):
    """
    Deletes the sessions from the DynamoDB table in bulk.
    """
    with get_db().batch_writer() as batch:
        for session_id in session_ids:
            batch.delete_item(
                Key={
                    'id': session_id
                }
            )


def delete_session_images(sessions_ids):
    """
    Deletes the images of the sessions from the S3 bucket in bulk.
    """
    s3_client = boto3.client("s3")
    delete_list = []
    for session_id in sessions_ids:
        for file in ["selfie", "student-id"]:
            delete_list.append({'Key': f"{session_id}/{file}"})

    s3_client.delete_objects(
        Bucket=os.environ["APP_BUCKET_NAME"],
        Delete={
            'Objects': delete_list
        }
    )
