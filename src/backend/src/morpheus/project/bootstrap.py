from flask import Blueprint

from .cli_commands import register_cli_commands
from .routes import register_routes


def bootstrap_project_module(app):
    project_blueprint = Blueprint('project', __name__)

    register_routes(project_blueprint)
    register_cli_commands(project_blueprint)

    app.register_blueprint(project_blueprint, url_prefix='/projects', cli_group='project')
