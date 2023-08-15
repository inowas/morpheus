from morpheus.authentication.app import register as register_auth_package
from morpheus.user.app import register as register_user_package
from flask import Flask


def register(app: Flask):
    register_user_package(app)
    register_auth_package(app)
