from flask import Blueprint, Flask
from morpheus.authentication.infrastructure.oauth2.server import authorization, config_oauth


def bootstrap(app: Flask):
    config_oauth(app)

    blueprint = Blueprint('authentication', __name__)

    @blueprint.route('/oauth/token', methods=['POST'])
    def issue_token():
        return authorization.create_token_response()

    app.register_blueprint(blueprint, url_prefix='/auth', cli_group='auth')
