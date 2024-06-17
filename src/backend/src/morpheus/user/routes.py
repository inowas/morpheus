from flask import Blueprint
from flask_cors import CORS


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)
