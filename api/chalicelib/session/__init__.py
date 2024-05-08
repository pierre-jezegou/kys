import datetime
import os
import uuid
from typing import Literal

import boto3
from chalice import BadRequestError, Blueprint, NotFoundError

from chalicelib.db import get_db

SessionState = Literal["pending", "verified", "expired"]

bp = Blueprint(__name__)


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

    id = str(uuid.uuid4())
    state = "pending"
    created = datetime.datetime.now().isoformat()

    get_db().put_item(
        Item={
            "id": id,
            "name": name,
            "university": university,
            "state": state,
            "created": created,
            "updated": created,
        }
    )

    return {"sessionId": id}


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

    session = get_db().get_item(Key={"id": session_id}).get("Item")

    if not session:
        raise NotFoundError("Session not found.")

    return session


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
