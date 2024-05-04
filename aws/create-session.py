import json
import boto3
import uuid
import datetime

dynamodb = boto3.client('dynamodb')


def lambda_handler(event, context):
    
    dynamo_db_table = 'student-data'

    session_id = str(uuid.uuid4())
    
    body_string = event.get('body', '').replace("'", '"')
    body = json.loads(body_string)
    
    name = body['name']
    university = body['university']
    status = "Created"
    # Created, selfie_uploaded, student_id_uploaded, finished_submission, rejected, approved
    now = str(datetime.datetime.now())
    dynamodb.put_item(
        TableName=dynamo_db_table,
        Item={
            'session_id': {'S': session_id},
            'name': {'S': name},
            'university': {'S': university},
            'status': {'S': status},
            'created': {'S': now}
        }
    )



    response = {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        'body': json.dumps({
            'sessionId': session_id
        })
    }
    return response
