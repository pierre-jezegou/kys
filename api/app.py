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
APP_BUCKET_NAME = os.environ.get('APP_BUCKET_NAME', '')



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
    """Create session for student to upload their documents

    This function generates a unique session ID for a student to upload their documents.
    It retrieves the student's name and university from the request body and creates a user object.
    The user object is then stored in the media database with the session ID as the key.
    Finally, a JSON response containing the session ID is returned.

    Returns:
        str: JSON response containing the session ID

    """

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

    get_media_db().add_media_file(session_id,
                                  media_type='json',
                                  labels=json.dumps(user))

    app.log.debug("New sessionId created: %s", session_id)

    return json.dumps({
            'sessionId': session_id
        })

@app.route('/presigned-url/{file}',
           methods=['POST'],
           cors=True)
# TODO OR ?
# @app.route('/presigned-url/{session_id}/{file}', methods=['POST'])
def create_presigned_url(file: str):
    """Create a presigned URL for the client to upload a file to S3.
    
    Args:
        file (str): The name of the file to be uploaded.
        
    Returns:
        str: The presigned URL for the client to upload the file.
    """
    
    body = app.current_request.json_body
    session_id = body['sessionId']
    # OR
    # session_id = session_id
    content_type = body['contentType']

    presigned_url = s3_client.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': APP_BUCKET_NAME, 
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
    # Get all records from the DynamoDB table
    return get_rekognition_client.get_all_records()



@app.route('/session/{session_id}', methods=["GET"])
def get_record(session_id):
    """Get a record from the DynamoDB table."""
    pass
    # Get the record from the DynamoDB table corresponding to the session_id



@app.on_s3_event(bucket=APP_BUCKET_NAME, events=["s3:ObjectPut:*"])
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
        # Run Main verification process
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


def _main_check_process(session_id: str) -> bool:
    """Main function to check the process of the student submission.
    Check the status of the submission and update it accordingly.
    """
    # Extract user information from dynamodb
    user = get_media_db().get_media_file(session_id)
    university = user['university']
    name = user['name']

    # Get the bucket and key of the student id
    bucket = APP_BUCKET_NAME
    student_id_key = f"{session_id}/student-id"
    selfie_key = f"{session_id}/selfie"

    # Extract text from student id
    name_in_student_id = get_rekognition_client().image_contains_texts(bucket=bucket,
                                                                   object_name=student_id_key,
                                                                   texts=name)

    # Check if logo on the student id matches the university logo
    coherent_logo = get_rekognition_client().compare_logo(university=university,
                                                           bucket=bucket,
                                                           key=student_id_key)

    # Compare faces in the selfie and the student id
    compared_faces = get_rekognition_client().compare_faces(bucket=bucket,
                                                            source_object_name=student_id_key,
                                                            selfie_key=selfie_key)

    # Update status in dynamodb
    if name_in_student_id and coherent_logo and compared_faces:
        status = "approved"
    else:
        status = "denied"

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
    # If the status is denied
    if status == "denied":
        return {
            'sessionId': session_id,
            'verificationStatus': status,
            'message': 'Denied'
        }
    # Else (other status) - Pending
    return {
        'sessionId': session_id,
        'verificationStatus': status,
        'message': 'Pending'
    }
