from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from .incoming import authenticate
from .presentation.api.read.ReadProjectListRequestHandler import ReadProjectListRequestHandler
from .presentation.api.write.ProjectRequestHandlers import CreateProjectRequestHandler, UpdateMetadataRequestHandler
from .presentation.api.write.PermissionRequestHandlers import AddMemberRequestHandler, UpdateMemberRoleRequestHandler, \
    RemoveMemberRequestHandler, UpdateVisibilityRequestHandler
from .presentation.api.write.BaseModelRequestHandlers import UpdateTimeDiscretizationRequestHandler
from ..common.presentation.schema_validation.SchemaValidation import validate_request


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['POST'])
    @blueprint.route('/', methods=['POST'])
    @cross_origin()
    @validate_request
    @authenticate()
    def create_project():
        return CreateProjectRequestHandler().handle(request)

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @authenticate()
    def list_projects():
        return ReadProjectListRequestHandler().handle()

    @blueprint.route('/<project_id>/settings/metadata', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_settings_update_metadata(project_id: str):
        return UpdateMetadataRequestHandler().handle(request, project_id)

    @blueprint.route('/<project_id>/settings/members', methods=['POST'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_settings_add_member(project_id: str):
        return AddMemberRequestHandler().handle(request, project_id)

    @blueprint.route('/<project_id>/settings/members/<user_id>', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_settings_update_member_role(project_id: str, user_id: str):
        return UpdateMemberRoleRequestHandler().handle(request, project_id, user_id)

    @blueprint.route('/<project_id>/settings/members/<user_id>', methods=['DELETE'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_settings_remove_member(project_id: str, user_id: str):
        return RemoveMemberRequestHandler().handle(request, project_id, user_id)

    @blueprint.route('/<project_id>/settings/visibility', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_settings_update_visibility(project_id: str):
        return UpdateVisibilityRequestHandler().handle(request, project_id)

    @blueprint.route('/<project_id>/base_model/time_discretization', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_base_model_time_discretization_update(project_id: str):
        return UpdateTimeDiscretizationRequestHandler().handle(request, project_id)
