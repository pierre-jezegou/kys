import qrcode
import qrcode.image.svg
from chalice import BadRequestError, Blueprint, Response

bp = Blueprint(__name__)

@bp.route("/", methods=["GET"])
def generate_qrcode():
    data = bp.current_request.query_params and bp.current_request.query_params.get(
        "data"
    )
    if not data:
        raise BadRequestError("`data` query parameter is required")

    img = qrcode.make(data, image_factory=qrcode.image.svg.SvgPathImage)

    return Response(
        body=img.to_string(),
        headers={"Content-Type": "image/svg+xml"},
    )
