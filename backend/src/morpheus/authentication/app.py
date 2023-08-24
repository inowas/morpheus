import click
from flask import Blueprint, Flask, request

from morpheus.application.write.command_bus import CommandBus
from morpheus.authentication.infrastructure.oauth2.server import  config_oauth
from morpheus.authentication.presentation.api.oauth2 import IssueOAuth2TokenRequestHandler
from morpheus.authentication.presentation.cli.oauth2 import CreatePublicClientCliCommand


def bootstrap(app: Flask):
    config_oauth(app)

    blueprint = Blueprint('authentication', __name__)

    @blueprint.route('/oauth/token', methods=['POST'])
    def issue_token():
        request_handler = IssueOAuth2TokenRequestHandler()
        request_handler.handle()

    command_bus = CommandBus()

    @blueprint.cli.command('create-public-oauth2-client')
    @click.argument('name')
    def create(
        name: str,
    ):
        cli_command = CreatePublicClientCliCommand(command_bus)
        cli_command.run(name)

    app.register_blueprint(blueprint, url_prefix='/auth', cli_group='auth')
