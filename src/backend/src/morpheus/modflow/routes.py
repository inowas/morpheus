from flask import Blueprint
from flask_cors import CORS, cross_origin


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    def read_root():
        return 'OK', 200
