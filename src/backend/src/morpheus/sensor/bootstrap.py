from flask import Blueprint

from .cli_commands import register_cli_commands
from .routes import register_routes


def bootstrap_sensor_module(app):
    sensors_blueprint = Blueprint('sensor', __name__)

    register_routes(sensors_blueprint)
    register_cli_commands(sensors_blueprint)

    app.register_blueprint(sensors_blueprint, url_prefix='/sensors', cli_group='sensor')
