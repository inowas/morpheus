import os

from flask import Blueprint, request
from flask_cors import CORS, cross_origin
import yaml

from .presentation.api.read.ReadModflowModelListRequestHandler import RedModflowModelListRequestHandler
from .presentation.api.write.CreateModflowModelRequestHandler import CreateModflowModelRequestHandler
from ..common.presentation.schema_validation.SchemaValidation import validate_request

openapi_spec_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../../schema/openapi.yaml")


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('/schema', methods=['GET'])
    @cross_origin()
    def read_schema():
        with open(openapi_spec_file) as file:
            return yaml.load(file, Loader=yaml.FullLoader), 200

    @blueprint.route('', methods=['POST'])
    @blueprint.route('/', methods=['POST'])
    @validate_request(openapi_spec_file)
    @cross_origin()
    def create_modflow_model():
        return CreateModflowModelRequestHandler().handle(request), 201

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    def read_modflow_model_list():
        return RedModflowModelListRequestHandler().handle(request), 200
