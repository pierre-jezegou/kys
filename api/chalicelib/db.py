from functools import cache
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
import uuid
import datetime
from typing import Optional
from chalicelib.session.types import Session, SessionState

@cache
def get_db() -> boto3.resource:
    """
    Returns a DynamoDB resource.

    Returns:
        A DynamoDB resource.
    """
    return boto3.resource("dynamodb", region_name=os.environ["REGION_NAME"]).Table(os.environ["APP_TABLE_NAME"])