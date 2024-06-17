from flask import Blueprint

from .routes import register_routes
from .cli_commands import register_cli_commands


def bootstrap_user_module(app):
    user_blueprint = Blueprint('user', __name__)

    register_routes(user_blueprint)
    register_cli_commands(user_blueprint)

    app.register_blueprint(user_blueprint, url_prefix='/users', cli_group='user')
