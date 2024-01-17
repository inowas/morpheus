from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from .incoming import authenticate
from .presentation.api.read.ReadProjectListRequestHandler import ReadProjectListRequestHandler
from .presentation.api.write.CreateProjectRequestHandler import CreateProjectRequestHandler
from .presentation.api.write.UpdateMetadataRequestHandler import UpdateMetadataRequestHandler
from .presentation.api.write.UpdatePermissionsRequestHandlers import UpdateOwnerRequestHandler, \
    AddAdminUserRequestHandler, RemoveAdminUserRequestHandler, AddEditorUserRequestHandler, \
    RemoveEditorUserRequestHandler, AddObserverUserRequestHandler, RemoveObserverUserRequestHandler, \
    UpdateVisibilityRequestHandler
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
    def list_projects():
        return ReadProjectListRequestHandler().handle(), 200

    @blueprint.route('/<project_id>/metadata', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_metadata_update(project_id: str):
        return UpdateMetadataRequestHandler().handle(request, project_id), 204

    @blueprint.route('/<project_id>/permissions/owner', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_permissions_update_owner(project_id: str):
        return UpdateOwnerRequestHandler().handle(request, project_id), 204

    @blueprint.route('/<project_id>/permissions/admin', methods=['POST'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_permissions_add_admin(project_id: str):
        return AddAdminUserRequestHandler().handle(request, project_id), 204

    @blueprint.route('/<project_id>/permissions/admin', methods=['DELETE'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_permissions_remove_admin(project_id: str):
        return RemoveAdminUserRequestHandler().handle(request, project_id), 204

    @blueprint.route('/<project_id>/permissions/editor', methods=['POST'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_permissions_add_editor(project_id: str):
        return AddEditorUserRequestHandler().handle(request, project_id), 204

    @blueprint.route('/<project_id>/permissions/editor', methods=['DELETE'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_permissions_remove_editor(project_id: str):
        return RemoveEditorUserRequestHandler.handle(request, project_id), 204

    @blueprint.route('/<project_id>/permissions/observer', methods=['POST'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_permissions_add_observer(project_id: str):
        return AddObserverUserRequestHandler().handle(request, project_id), 204

    @blueprint.route('/<project_id>/permissions/observer', methods=['DELETE'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_permissions_remove_observer(project_id: str):
        return RemoveObserverUserRequestHandler.handle(request, project_id), 204

    @blueprint.route('/<project_id>/permissions/visibility', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_permissions_update_visibility(project_id: str):
        return UpdateVisibilityRequestHandler().handle(request, project_id), 204

    @blueprint.route('/<project_id>/base_model/time_discretization', methods=['PUT'])
    @cross_origin()
    @validate_request
    @authenticate()
    def project_base_model_time_discretization_update(project_id: str):
        return UpdateTimeDiscretizationRequestHandler().handle(request, project_id), 204
