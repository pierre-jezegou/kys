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




class SessionRepository:

    def __init__(self):
        self._table = self._get_table()

    def _get_table(self):
        dynamodb = boto3.resource('dynamodb',
                                  region_name=os.environ["REGION_NAME"])
        return dynamodb.Table(os.environ["APP_TABLE_NAME"])

    def list_all_sessions(self, filter_expression: Optional[Attr] = None):
        response = self._table.scan(
            FilterExpression=filter_expression
        )
        return response.get('Items')


    def add_session(self, name: str, university: str, state: Optional[SessionState]=None):
        id = str(uuid.uuid4())
        if not state:
            state = "pending"
        created = datetime.datetime.now().isoformat()

        item = {
                'id': id,
                'name': name,
                'university': university,
                'state': state,
                'created': created
            }

        self._table.put_item(
            Item=item
        )
        return item

    def get_session(self, id: str) -> Optional[Session]:
        response = self._table.get_item(
            Key=Key("id").eq(id),
        )
        return response.get('Item')

    def delete_session(self, id: str):
        self._table.delete_item(
            Key=Key("id").eq(id)
        )

    def update_session_state(self,
                             session_id: str,
                             state: SessionState):
        # We could also use update_item() with an UpdateExpression.
        self.update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": state},
        )
