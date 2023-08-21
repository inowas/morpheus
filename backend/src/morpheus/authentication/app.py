from flask import Blueprint, Flask

from morpheus.authentication.presentation.api.login import login_request_handler


def bootstrap(app: Flask):
    blueprints = Blueprint('authentication', __name__)

    @blueprints.route('/login', methods=['POST'])
    def login():
        return login_request_handler()

    app.register_blueprint(blueprints, url_prefix='/auth', cli_group='auth')
