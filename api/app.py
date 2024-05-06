"""Backend API for `Know Your Student` project."""
import uuid
import json
import datetime
import os
from dotenv import load_dotenv
load_dotenv()

import boto3
from chalice import Chalice
from chalicelib import db
from chalicelib import rekognition

app = Chalice(app_name='kys-api')
app.debug = True

_MEDIA_DB = None
_REKOGNITION_CLIENT = None

s3_client = boto3.client('s3')

DYNAMO_DB_TABLE = os.environ.get('MEDIA_TABLE_NAME', '')
BUCKET_NAME = os.environ.get('BUCKET_NAME', '')



def get_media_db():
    """Return the media database object."""
    global _MEDIA_DB
    if _MEDIA_DB is None:
        _MEDIA_DB = db.DynamoMediaDB(
            boto3.resource('dynamodb').Table(
                DYNAMO_DB_TABLE))
    return _MEDIA_DB

def get_rekognition_client():
    """Return the Rekognition client object."""
    global _REKOGNITION_CLIENT
    if _REKOGNITION_CLIENT is None:
        _REKOGNITION_CLIENT = rekognition.RekognitionClient(
            boto3.client('rekognition'))
    return _REKOGNITION_CLIENT



@app.route('/session',
           methods=['POST'],
           content_types=['application/json'],
           cors=True)
def create_session():
    """Create session for student to upload their documents"""

    session_id = str(uuid.uuid4())
    body = app.current_request.json_body

    name = body['name']
    university = body['university']
    status = "Created"

    now = str(datetime.datetime.now())

    user = {
        'name': name,
        'university': university,
        'status': status,
        'created': now
    }

    get_media_db().add_media_file(session_id, media_type='json', labels=json.dumps(user))

    response = json.dumps({
            'sessionId': session_id
        })

    app.log.debug("New sessionId created: %s", session_id)

    return response

@app.route('/presigned-url/{file}',
           methods=['POST'],
           cors=True)



# OR ?
# @app.route('/presigned-url/{session_id}/{file}', methods=['POST'])
def create_presigned_url(file: str):
    """Create a presigned URL for the client to upload a file to S3."""
    body = app.current_request.json_body
    session_id = body['sessionId']
    # OR
    # session_id = session_id
    content_type = body['contentType']

    presigned_url = s3_client.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': BUCKET_NAME, 
            'Key': f"{session_id}/{file}",
            'ContentType': content_type,
        },
        ExpiresIn=60, # TODO Ajust this value
        HttpMethod='PUT'
    )

    return json.dumps(presigned_url)




@app.route('/session', methods=["GET"])
def get_all_records():
    """Get all records from the DynamoDB table."""
    pass
    # Get all records from the DynamoDB table



@app.route('/session/{session_id}', methods=["GET"])
def get_record(session_id):
    """Get a record from the DynamoDB table."""
    pass
    # Get the record from the DynamoDB table corresponding to the session_id



@app.on_s3_event(bucket=BUCKET_NAME, events=["s3:ObjectPut:*"])
def lambda_handler(event):
    """Process S3 event related to image upload and update DynamoDB."""
    app.log.debug("Received event for bucket: %s, key: %s", event.bucket, event.key)
    key = event.key
    session_id = key.split('/')[0]
    image = key.split('/')[1]

    # Extract user information from dynamodb
    user = get_media_db().get_media_file(session_id)

    if image == "selfie":
        message = 'Selfie uploaded - status updated'
        app.log.debug(message)

    if image == "student-id":
        message = 'Student id uploaded - status updated'
        app.log.debug(message)
        _main_check_process(session_id)

    # Update status in dynamodb
    user['status'] = message

    # Write in dynamodb the status of the submission depending on session_id
    get_media_db().add_media_file(session_id,
                                  media_type='json',
                                  labels=json.dumps(user))

    return {
        'sessionId': session_id,
        'message': message
        }


def _extract_text_from_student_id(bucket: str, key: str) -> list[str]:
    """Extract text from the student id image with AWS Rekognition.
    Return a list of text detected in the image."""
    response = get_rekognition_client().detect_text(bucket, key) # To improve
    return response['TextDetections']

def _compare_logo(university: str, bucket: str, key: str) -> bool:
    """Compare the logo of the university with the logo on the student id.
    Return True if the logos match, False otherwise.
    University: name of the university
    Source image: student id"""

    # Extract the logo of the university

    # Compare if the logos match

    return True

def _compare_faces(bucket: str, student_id_key: str, selfie_key: str) -> bool:
    """Compare the faces in the selfie and the student id.
    Return True if the faces match, False otherwise.
    Source image: student id
    Target image: selfie
    """

    # Assert there is the `selfie` in the bucket
    # No need to assert student id is in the bucket because
    # this event trigger the lambda only if the student id is uploaded

    # Source image : from student id (bucket)

    # Target image : from selfie (bucket)

    # Compute similarity: with Rekognition
    similarity = False

    return similarity


def _main_check_process(session_id: str) -> bool:
    """Main function to check the process of the student submission.
    Check the status of the submission and update it accordingly.
    """
    # Extract user information from dynamodb
    user = get_media_db().get_media_file(session_id)
    university = user['university']
    name = user['name']

    # Get the bucket and key of the student id
    bucket = BUCKET_NAME
    student_id_key = f"{session_id}/student-id"
    selfie_key = f"{session_id}/selfie"

    # Extract text from student id
    extracted_text = _extract_text_from_student_id(bucket=bucket, key=student_id_key)

    # Find name in the extracted text
    name_found = False
    for text in extracted_text:
        if text == name:
            name_found = True
            break

    # Check if logo on the student id matches the university logo
    coherent_logo = _compare_logo(university=university,
                                  bucket=bucket,
                                  key=student_id_key)

    # Compare faces in the selfie and the student id
    compared_faces = _compare_faces(bucket=bucket,
                                    student_id_key=student_id_key,
                                    selfie_key=selfie_key)

    # Update status in dynamodb
    if name_found and coherent_logo and compared_faces:
        status = "approved"
    else:
        status = "rejected"

    # Write in dynamodb
    user['status'] = status
    get_media_db().add_media_file(session_id,
                                  media_type='json',
                                  labels=json.dumps(user))

    return status=="approved"



@app.route('/session/{session_id}', methods=["GET"])
def check_result(session_id):
    """Check the status of the submission and update it accordingly."""
    # Get user information from dynamodb
    user = get_media_db().get_media_file(session_id)
    status = user['status']

    # If the status is approved
    if status == "approved":
        return {
            'sessionId': session_id,
            'verificationStatus': status,
            'message': 'Approved'
        }
    # If the status is rejected
    if status == "rejected":
        return {
            'sessionId': session_id,
            'verificationStatus': status,
            'message': 'Rejected'
        }
    # Else (other status) - Pending
    return {
        'sessionId': session_id,
        'verificationStatus': status,
        'message': 'Pending'
    }
