from flask import Blueprint, Flask, request

from morpheus.authentication.infrastructure.oauth2.server import authorization


def bootstrap(app: Flask):
    blueprint = Blueprint('authentication', __name__)

    @blueprint.route('/oauth/token', methods=['POST'])
    def issue_token():
        return authorization.create_token_response()

    app.register_blueprint(blueprint, url_prefix='/auth', cli_group='auth')
