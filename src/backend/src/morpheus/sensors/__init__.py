from flask import Blueprint

from .routes import register_routes
from .cli_commands import register_cli_commands


def bootstrap_sensors_module(app):
    sensors_blueprint = Blueprint('sensors', __name__)

    register_routes(sensors_blueprint)
    register_cli_commands(sensors_blueprint)

    app.register_blueprint(sensors_blueprint, url_prefix='/sensors', cli_group='sensors')
