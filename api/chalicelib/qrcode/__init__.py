import qrcode
import qrcode.image.svg
from chalice import BadRequestError, Blueprint, Response

qrcode_routes = Blueprint(__name__)


@qrcode_routes.route("/", methods=["GET"])
def generate_qrcode():
    data = (
        qrcode_routes.current_request.query_params
        and qrcode_routes.current_request.query_params.get("data")
    )
    if not data:
        raise BadRequestError("`data` query parameter is required")

    img = qrcode.make(data, image_factory=qrcode.image.svg.SvgPathImage)

    return Response(
        body=img.to_string(),
        headers={"Content-Type": "image/svg+xml"},
    )
