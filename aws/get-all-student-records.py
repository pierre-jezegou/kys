import json
import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    dynamo_db_table = 'student-data'

    response = dynamodb.scan(TableName=dynamo_db_table)
    items = response['Items']
    while 'LastEvaluatedKey' in response:
        response = dynamodb.scan(TableName=dynamo_db_table, ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])
    
    return response['Items']
