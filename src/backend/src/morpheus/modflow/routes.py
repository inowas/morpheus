from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from .incoming import authenticate
from .presentation.api.read.ReadModflowModelListRequestHandler import ReadModflowModelListRequestHandler
from .presentation.api.write.CreateModflowModelRequestHandler import CreateModflowModelRequestHandler
from ..common.presentation.schema_validation.SchemaValidation import validate_request


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['POST'])
    @blueprint.route('/', methods=['POST'])
    @cross_origin()
    @validate_request
    @authenticate()
    def create_modflow_model():
        return CreateModflowModelRequestHandler().handle(request), 201

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @authenticate(requires_logged_in_user=False)
    def read_modflow_model_list():
        return ReadModflowModelListRequestHandler().handle(request), 200
