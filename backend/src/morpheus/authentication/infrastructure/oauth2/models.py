from datetime import time
from authlib.integrations.sqla_oauth2 import OAuth2ClientMixin, OAuth2AuthorizationCodeMixin, OAuth2TokenMixin
from flask import Flask

from morpheus.common.infrastructure.persistence.database import db


class OAuth2User(db.Model):
    __tablename__ = 'oauth2_user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), unique=True)

    def __str__(self):
        return self.username

    def get_user_id(self):
        return self.id

    def check_password(self, password):
        return password == 'valid'


class OAuth2Client(db.Model, OAuth2ClientMixin):
    __tablename__ = 'oauth2_client'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey('oauth2_user.id', ondelete='CASCADE'))
    user = db.relationship('OAuth2User')


class OAuth2AuthorizationCode(db.Model, OAuth2AuthorizationCodeMixin):
    __tablename__ = 'oauth2_code'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey('oauth2_user.id', ondelete='CASCADE'))
    user = db.relationship('OAuth2User')


class OAuth2Token(db.Model, OAuth2TokenMixin):
    __tablename__ = 'oauth2_token'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey('oauth2_user.id', ondelete='CASCADE'))
    user = db.relationship('OAuth2User')

    def is_refresh_token_active(self):
        if self.revoked:
            return False
        expires_at = self.issued_at + self.expires_in * 2
        return expires_at >= time.time()


def create_tables(app: Flask):
    with app.app_context():
        db.metadata.create_all(db.engine, tables=[OAuth2User.__table__, OAuth2Client.__table__, OAuth2AuthorizationCode.__table__])


def drop_tables(app: Flask):
    with app.app_context():
        db.metadata.drop_all(db.engine, tables=[OAuth2User.__table__, OAuth2Client.__table__, OAuth2AuthorizationCode.__table__])
