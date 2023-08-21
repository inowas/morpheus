from flask import Flask
from morpheus.authentication.app import bootstrap as bootstrap_authentication_package
from morpheus.user.app import bootstrap as bootstrap_user_package


def bootstrap(app: Flask):
    bootstrap_authentication_package(app)
    bootstrap_user_package(app)
