import time

from authlib.integrations.flask_oauth2 import (
    AuthorizationServer,
    ResourceProtector, current_token,
)
from authlib.integrations.sqla_oauth2 import (
    create_query_client_func,
    create_save_token_func,
    create_revocation_endpoint,
    create_bearer_token_validator,
)
from authlib.oauth2.rfc6749 import grants

from morpheus.common.infrastructure.persistence.database import db
from morpheus.authentication.infrastructure.oauth2.models import OAuth2Client, OAuth2Token, OAuth2User
from morpheus.authentication.infrastructure.password import verify_password
from morpheus.authentication.types.oauth2 import UserId


class PasswordGrant(grants.ResourceOwnerPasswordCredentialsGrant):
    TOKEN_ENDPOINT_AUTH_METHODS = ['none']

    def authenticate_user(self, username, password):
        user = OAuth2User.query.filter_by(email=username).first()
        if user is not None and verify_password(user.password_hash, password):
            return user


class RefreshTokenGrant(grants.RefreshTokenGrant):
    TOKEN_ENDPOINT_AUTH_METHODS = ['none']
    INCLUDE_NEW_REFRESH_TOKEN = True

    def authenticate_refresh_token(self, refresh_token):
        token = OAuth2Token.query.filter_by(refresh_token=refresh_token).first()
        if token and token.is_refresh_token_active():
            return token

    def authenticate_user(self, credential):
        user = OAuth2User.query.filter_by(id=credential.user_id).first()
        if user is not None:
            return user

    def revoke_old_credential(self, credential):
        now = time.time()
        credential.access_token_revoked_at = now
        credential.refresh_token_revoked_at = now
        db.session.add(credential)
        db.session.commit()


query_client = create_query_client_func(db.session, OAuth2Client)
save_token = create_save_token_func(db.session, OAuth2Token)
oauth2_server = AuthorizationServer(
    query_client=query_client,
    save_token=save_token,
)
require_oauth = ResourceProtector()


def config_oauth(app):
    app.config['OAUTH2_REFRESH_TOKEN_GENERATOR'] = True
    oauth2_server.init_app(app)

    # supported grants
    oauth2_server.register_grant(PasswordGrant)
    oauth2_server.register_grant(RefreshTokenGrant)

    # support revocation
    revocation_cls = create_revocation_endpoint(db.session, OAuth2Token)
    revocation_cls.CLIENT_AUTH_METHODS = ['none']
    oauth2_server.register_endpoint(revocation_cls)

    # protect resource
    bearer_cls = create_bearer_token_validator(db.session, OAuth2Token)
    require_oauth.register_token_validator(bearer_cls())


def authenticated_oauth_user_id() -> UserId | None:
    if not hasattr(current_token, 'user_id'):
        return None

    return UserId(getattr(current_token, 'user_id'))
