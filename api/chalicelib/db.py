from functools import cache
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
import uuid
import datetime
from Typing import Optional
from chalicelib.session import Session

@cache
def get_db() -> boto3.resource:
    """
    Returns a DynamoDB resource.

    Returns:
        A DynamoDB resource.
    """
    return boto3.resource("dynamodb", region_name=os.environ["REGION_NAME"]).Table(os.environ["APP_TABLE_NAME"])




class SessionRepository:
    
    def __init__(self, table_resource):
        self._table = table_resource

    def list_all_sessions(self):
        response = self._table.scan()
        return response.get('Items')


    def add_session(self, name: str, university: str, state: Optional[str]):
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

        self._table.put_session(
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
                             state: str):
        # We could also use update_item() with an UpdateExpression.
        self.update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": state},
        )
