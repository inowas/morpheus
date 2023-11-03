import os

from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from .presentation.api.read.ReadModflowModelListRequestHandler import RedModflowModelListRequestHandler
from .presentation.api.write.CreateModflowModelRequestHandler import CreateModflowModelRequestHandler
from ..common.presentation.schema_validation.SchemaValidation import validate_request
from ..settings import settings


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['POST'])
    @blueprint.route('/', methods=['POST'])
    @validate_request(settings.OPENAPI_SPEC_FILE)
    @cross_origin()
    def create_modflow_model():
        return CreateModflowModelRequestHandler().handle(request), 201

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    def read_modflow_model_list():
        return RedModflowModelListRequestHandler().handle(request), 200
