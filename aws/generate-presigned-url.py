import json
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    bucket_name = 'kys-student-images'
    body = json.loads(event['body'])
    
    session_id = body['sessionId']
    content_type = body['contentType']
    
    if event['path'] == '/presigned-url/selfie':
        key = "selfie"
    elif event['path'] == '/presigned-url/student-id':
        key = "student-id"
    else:
        raise KeyError

    presigned_url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': bucket_name, 
            'Key': f"{session_id}/{key}",
            'ContentType': content_type,
        },
        ExpiresIn=3600,
        HttpMethod='PUT'
    )
    
    return {
        'statusCode': 200,
        'headers': {
           'Access-Control-Allow-Origin': '*',
           "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
           "ContentType": "application/json"
       },
        'body': json.dumps(presigned_url)
    }