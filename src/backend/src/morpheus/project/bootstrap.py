from flask import Blueprint

from .routes import register_routes
from .cli_commands import register_cli_commands


def bootstrap_project_module(app):
    project_blueprint = Blueprint('project', __name__)

    register_routes(project_blueprint)
    register_cli_commands(project_blueprint)

    app.register_blueprint(project_blueprint, url_prefix='/projects', cli_group='project')
