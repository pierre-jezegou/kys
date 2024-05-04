import json
import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    """Update the status of the student submission in the DynamoDB table."""
    s3_event = event['Records'][0]['s3']
    object_key = s3_event['object']['key']

    session_id = object_key.split('/')[0]
    image = object_key.split('/')[1]

    if image == 'selfie.png':
        new_status = 'Selfie uploaded'
    elif image == 'student-id.png':
        new_status = 'Student id uploaded'
    else:
        new_status = 'Unknown'

    dynamo_db_table = 'student-data'
    dynamodb.update_item(
        TableName=dynamo_db_table,
        Key={
            'session_id': {'S': session_id}
        },
        UpdateExpression='SET #s = :status',
        ExpressionAttributeNames={'#s': 'status'},
        ExpressionAttributeValues={
            ':status': {'S': new_status}
        }
    )

    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Status updated'
        })
    }
