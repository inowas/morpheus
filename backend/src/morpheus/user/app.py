import click
from flask import Flask, Blueprint

from morpheus.common.infrastructure.persistence.database import db
from morpheus.user.application.create_user import CreateUserCommandHandler
from morpheus.user.infrastructure.persistence.user import UserRepository
from morpheus.user.presentation.cli.user import CreateUserCliCommand


def bootstrap(app: Flask):
    blueprint = Blueprint('user', __name__)

    @blueprint.route('/me', methods=['GET'])
    def login():
        return '<h1>Me</h1>'

    @blueprint.cli.command('create')
    @click.argument('email')
    @click.argument('password')
    def create(
        email: str,
        password: str,
    ):
        cli_command = CreateUserCliCommand(CreateUserCommandHandler(UserRepository(db.engine)))
        cli_command.run(email, password)

    app.register_blueprint(blueprint, url_prefix='/user', cli_group='user')
