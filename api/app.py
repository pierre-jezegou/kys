from chalice import Chalice
from chalicelib.qrcode import bp as qrcode
from chalicelib.session import bp as session
from chalicelib.verification import bp as verification

app = Chalice(app_name="kys-api")
app.register_blueprint(qrcode, url_prefix="/qrcode")
app.register_blueprint(session, url_prefix="/session")
app.register_blueprint(verification, url_prefix="/verification")
