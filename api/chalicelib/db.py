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
    return boto3.resource("dynamodb", region_name=os.environ["REGION_NAME"]).Table(os.environ["APP_TABLE_NAME"])

