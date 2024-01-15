from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from .incoming import authenticate
from .presentation.api.read.ReadProjectListRequestHandler import ReadProjectListRequestHandler
from .presentation.api.write.CreateProjectRequestHandler import CreateProjectRequestHandler
from .presentation.api.write.UpdateMetadataRequestHandler import UpdateMetadataRequestHandler
from .presentation.api.write.UpdateTimeDiscretizationRequestHandler import \
    UpdateTimeDiscretizationRequestHandler
from ..common.presentation.schema_validation.SchemaValidation import validate_request


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['POST'])
    @blueprint.route('/', methods=['POST'])
    @cross_origin()
    @validate_request
    @authenticate()
    def create_project():
        return CreateProjectRequestHandler().handle(request), 201

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @authenticate()
    def read_project_list():
        return ReadProjectListRequestHandler().handle(request), 200

    @blueprint.route('/<project_id>/metadata', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def update_metadata(project_id: str):
        return UpdateMetadataRequestHandler().handle(request, project_id), 201

    @blueprint.route('/<project_id>/base_model/time_discretization', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def update_project_base_model_time_discretization(project_id: str):
        return UpdateTimeDiscretizationRequestHandler().handle(request, project_id), 201
