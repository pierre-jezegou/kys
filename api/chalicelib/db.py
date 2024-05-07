# FROM https://github.com/aws-samples/chalice-workshop.git
from boto3.dynamodb.conditions import Attr


class DynamoMediaDB(object):
    def __init__(self, table_resource) -> None:
        """
        Initializes a DynamoMediaDB object.

        Args:
            table_resource: The DynamoDB table resource to be used.

        Returns:
            None
        """
        self._table = table_resource

    def add_media_file(self,
                       session_id: str,
                       media_type, labels=None) -> None:
        """
        Adds a media file to the DynamoDB table.

        Args:
            name: The name of the media file.
            media_type: The type of the media file.
            labels: Optional. A list of labels associated with the media file.

        Returns:
            None
        """
        if labels is None:
            labels = []
        self._table.put_item(
            Item={
                'sessionId': session_id, # Not 100% sure
                'type': media_type,
                'labels': labels,
            }
        )

    def get_media_file(self, session_id: str) -> dict | None:
        """
        Retrieves a media file from the DynamoDB table.

        Args:
            name: The name of the media file to retrieve.

        Returns:
            The media file item as a dictionary, or None if not found.
        """
        response = self._table.get_item(
            Key={
                'sessionId': session_id, # Not 100% sure, maybe Name field
            },
        )
        return response.get('Item')
    
    def get_all_records(self):
        """
        Retrieves all records from the 'student-data' DynamoDB table.

        Returns:
            A list of records from the 'student-data' table.
        """

        response = self._table.scan()
        
        return response['Items']