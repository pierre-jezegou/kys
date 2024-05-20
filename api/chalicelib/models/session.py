import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
import uuid
import datetime
from typing import Optional, TypedDict, Literal

SessionState = Literal[
    "created",
    "selfie-submitted",
    "student-id-submitted",
    "face-not-detected",
    "too-many-faces",
    "faces-not-matched",
    "text-not-detected",
    "text-not-matched",
    "approved",
]


class Session(TypedDict):
    id: str
    name: str
    university: str
    created: str
    updated: str
    state: SessionState


class SessionRepository:
    """
    A repository for managing sessions in DynamoDB.
    """

    def __init__(self):
        self._table = self._get_table()

    def _get_table(self):
        """
        Retrieves the DynamoDB table.

        Returns:
            The DynamoDB table.
        """
        dynamodb = boto3.resource("dynamodb", region_name=os.environ["REGION_NAME"])
        return dynamodb.Table(os.environ["APP_TABLE_NAME"])

    def list_all_sessions(self, filter_expression: Optional[Attr] = None):
        """
        Lists all sessions in the DynamoDB table.

        Args:
            filter_expression: An optional filter expression.

        Returns:
            A list of session items.
        """
        if not filter_expression:
            return self._table.scan().get("Items")
        else:
            return self._table.scan(FilterExpression=filter_expression).get("Items")

    def add_session(
        self, name: str, university: str, state: Optional[SessionState] = None
    ):
        """
        Adds a new session to the DynamoDB table.

        Args:
            name: The name of the session.
            university: The university associated with the session.
            state: The state of the session (optional).

        Returns:
            The added session item.
        """
        id = str(uuid.uuid4())
        if not state:
            state = "pending"
        created = datetime.datetime.now().isoformat()

        item = {
            "id": id,
            "name": name,
            "university": university,
            "state": state,
            "created": created,
        }

        self._table.put_item(Item=item)
        return item

    def get_session(self, id: str) -> Optional[Session]:
        """
        Retrieves a session from the DynamoDB table.

        Args:
            id: The ID of the session.

        Returns:
            The retrieved session item, or None if not found.
        """
        response = self._table.get_item(Key={"id": id})
        return response.get("Item")

    def delete_session(self, id: str):
        """
        Deletes a session from the DynamoDB table.

        Args:
            id: The ID of the session.
        """
        self._table.delete_item(Key=Key("id").eq(id))

    def delete_sessions(self, session_ids: list[Session]):
        """
        Deletes multiple sessions from the DynamoDB table.

        Args:
            session_ids: A list of session IDs.
        """
        with self._table.batch_writer() as batch:
            for session_id in session_ids:
                batch.delete_item(Key={"id": session_id})

    def update_session_state(self, session_id: str, state: SessionState):
        """
        Updates the state of a session in the DynamoDB table.

        Args:
            session_id: The ID of the session.
            state: The new state of the session.
        """
        # We could also use update_item() with an UpdateExpression.
        self._table.update_item(
            Key={"id": session_id},
            UpdateExpression="SET #state = :state",
            ExpressionAttributeNames={"#state": "state"},
            ExpressionAttributeValues={":state": state},
        )
