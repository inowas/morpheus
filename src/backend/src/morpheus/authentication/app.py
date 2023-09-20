from flask import Blueprint, Flask
from morpheus.authentication.application.write.command_bus import authentication_command_bus
from morpheus.authentication.infrastructure.oauth2.server import config_oauth
from morpheus.authentication.presentation.api.oauth2 import IssueOAuth2TokenRequestHandler, \
    RevokeOAuth2TokenRequestHandler
from morpheus.authentication.presentation.cli.oauth2 import CreatePublicClientCliCommand


def bootstrap(app: Flask):
    config_oauth(app)

    blueprint = Blueprint('authentication', __name__)

    @blueprint.route('/oauth/token', methods=['POST'])
    def issue_token():
        request_handler = IssueOAuth2TokenRequestHandler()
        return request_handler.handle()

    @blueprint.route('/oauth/revoke', methods=['POST'])
    def revoke_token():
        request_handler = RevokeOAuth2TokenRequestHandler()
        return request_handler.handle()

    @blueprint.cli.command('create-public-oauth2-client')
    def create():
        cli_command = CreatePublicClientCliCommand(authentication_command_bus)
        cli_command.run()

    app.register_blueprint(blueprint, url_prefix='/auth', cli_group='auth')
