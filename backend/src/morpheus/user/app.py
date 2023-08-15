import click
from flask import Flask, Blueprint

from morpheus.user.infrastructure.persistence.user_repository import PostgresUserRepository
from morpheus.user.presentation.cli.create_user_command import CreateUserCommand


def register(app: Flask):
    blueprints = Blueprint('user', __name__)

    user_repository = PostgresUserRepository(app.config)

    @blueprints.route('/me', methods=['GET'])
    def login():
        return '<h1>Me</h1>'

    @blueprints.cli.command('create')
    @click.argument('email')
    @click.argument('password')
    def create(email: str, password: str):
        # TODO error handling in CliCommand (try catch); CommandResult with error message
        command = CreateUserCommand(user_repository, email, password)
        result = command.execute()
        if result.is_success():
            click.echo('User created')
            return

        click.echo('User could not be created')

    app.register_blueprint(blueprints, url_prefix='/user', cli_group='user')

