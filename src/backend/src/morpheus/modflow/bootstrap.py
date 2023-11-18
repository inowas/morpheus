from flask import Blueprint

from .routes import register_routes
from .cli_commands import register_cli_commands


def bootstrap_modflow_module(app):
    modflow_blueprint = Blueprint('modflow', __name__)

    register_routes(modflow_blueprint)
    register_cli_commands(modflow_blueprint)

    app.register_blueprint(modflow_blueprint, url_prefix='/modflow', cli_group='modflow')
