import time
from authlib.integrations.sqla_oauth2 import OAuth2ClientMixin, OAuth2TokenMixin
from morpheus.common.infrastructure.persistence.database import db


class OAuth2Client(db.Model, OAuth2ClientMixin):
    __tablename__ = 'oauth2_client'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36))


class OAuth2Token(db.Model, OAuth2TokenMixin):
    __tablename__ = 'oauth2_token'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36))

    def is_refresh_token_active(self):
        if self.is_revoked() != 0:
            return False
        expires_at = self.issued_at + self.expires_in * 2
        return expires_at >= time.time()

    def is_revoked(self) -> bool:
        return super().is_revoked() != 0
