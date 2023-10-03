import click
from flask import Flask, Blueprint

from morpheus.user.application.read import reader
from morpheus.user.application.write.command_bus import user_command_bus
from morpheus.user.incoming import require_authentication
from morpheus.user.presentation.cli.user import CreateUserCliCommand


def bootstrap(app: Flask):
    blueprint = Blueprint('user', __name__)

    @blueprint.route('/me', methods=['GET'])
    @require_authentication()
    def me():
        return reader.read_authenticated_user_profile()

    @blueprint.cli.command('create')
    @click.argument('email', type=str)
    @click.argument('password', type=str)
    def create(
        email: str,
        password: str,
    ):
        cli_command = CreateUserCliCommand(user_command_bus)
        cli_command.run(email, password)

    app.register_blueprint(blueprint, url_prefix='/user', cli_group='user')
