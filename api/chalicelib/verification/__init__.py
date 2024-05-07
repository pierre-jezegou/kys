import os
from chalice import Blueprint

bp = Blueprint(__name__)


@bp.on_s3_event(bucket=os.environ["APP_BUCKET_NAME"], events=["s3:ObjectCreated:*"])
def s3_handler(event):
    bp.log.debug(f"Received event: {event}")
