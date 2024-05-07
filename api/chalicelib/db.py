from functools import cache
import os
import boto3


@cache
def get_db() -> boto3.resource:
    """
    Returns a DynamoDB resource.

    Returns:
        A DynamoDB resource.
    """
    return boto3.resource("dynamodb").Table(os.environ["APP_TABLE_NAME"])

