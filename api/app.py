from chalice import Chalice
from chalicelib.qrcode import bp as qrcode
from chalicelib.session import bp as session

app = Chalice(app_name="kys-api")
app.register_blueprint(qrcode, url_prefix="/qrcode")
app.register_blueprint(session, url_prefix="/session")
