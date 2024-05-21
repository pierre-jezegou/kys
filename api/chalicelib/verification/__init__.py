import os

import boto3
from chalice import Blueprint, NotFoundError

from chalicelib.models.session import SessionRepository
from chalicelib.rekognition import RekognitionClient

APP_BUCKET_NAME = os.environ["APP_BUCKET_NAME"]

bp = Blueprint(__name__)

session_respository = SessionRepository()
rekognition_client = RekognitionClient()


@bp.on_s3_event(bucket=APP_BUCKET_NAME, events=["s3:ObjectCreated:*"])
def handle_s3_event(event):
    print(f"Received S3 event: {event}")

    session_id, file = event.key.split("/")

    if file not in ["selfie", "student-id"]:
        return

    if file == "selfie":
        # Update the session state, state = selfie-submitted
        session_respository.update_session_state(session_id, "selfie-submitted")

    if file == "student-id":
        # Update the session state, state = student-id-submitted
        session_respository.update_session_state(session_id, "selfie-submitted")

    session = session_respository.get_session(session_id)

    if not session:
        raise NotFoundError("Session not found.")

    selfie_object_name = f"{session_id}/selfie"
    student_id_object_name = f"{session_id}/student-id"

    # Detect faces in the images
    selfie_faces = rekognition_client.detect_faces(APP_BUCKET_NAME, selfie_object_name)
    student_id_faces = rekognition_client.detect_faces(
        APP_BUCKET_NAME, student_id_object_name
    )

    if selfie_faces != 1 or student_id_faces != 1:
        # Update the session state, state = more-than-one-face
        session_respository.update_session_state(session_id, "more-than-one-face")
        return

    # Check if text matches
    text_matches = rekognition_client.image_contains_texts(
        APP_BUCKET_NAME,
        student_id_object_name,
        name=session["name"],
        university=session["university"],
    )

    if not text_matches:
        # Update the session state, state = text-not-matched

        session_respository.update_session_state(session_id, "text-not-matched")
        return

    # Check if faces match
    faces_match = rekognition_client.compare_faces(
        APP_BUCKET_NAME, selfie_object_name, student_id_object_name, 90
    )

    if not faces_match:
        # Update the session state, state = faces-not-matched

        session_respository.update_session_state(session_id, "faces-not-matched")
        return

    # Update the session state, state = approved
    session_respository.update_session_state(session_id, "approved")
