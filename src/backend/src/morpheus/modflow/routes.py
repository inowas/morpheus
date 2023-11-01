from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from .presentation.api.read.JsonSchemaRequestHandler import JsonSchemaRequestHandler
from .presentation.api.write.MessageBoxRequestHandler import MessageBoxRequestHandler


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    def read_root():
        return 'OK', 200

    @blueprint.route('/schema', methods=['GET'])
    @cross_origin()
    def read_schema():
        return JsonSchemaRequestHandler().handle(), 200

    @blueprint.route('/messagebox', methods=['POST'])
    @cross_origin()
    def post_messagebox():
        return MessageBoxRequestHandler.handle(request), 201
