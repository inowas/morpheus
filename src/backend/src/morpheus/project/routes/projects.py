from flask import Blueprint, request
from flask_cors import cross_origin

from ...common.presentation.api.middleware.schema_validation import validate_request
from ...common.types.ResourceCreated import ResourceCreated
from ..incoming import authenticate
from ..presentation.api.read.projects.ReadProjectEventLogRequestHandler import ReadProjectEventLogRequestHandler
from ..presentation.api.read.projects.ReadProjectListRequestHandler import ReadProjectListRequestHandler
from ..presentation.api.read.projects.ReadProjectMetadataRequestHandler import ReadProjectMetadataRequestHandler
from ..presentation.api.read.projects.ReadProjectPrivilegesRequestHandler import ReadProjectPrivilegesRequestHandler
from ..presentation.api.write.MessageBoxRequestHandler import MessageBoxRequest, MessageBoxRequestHandler
from ..types.Project import ProjectId


def register_routes(blueprint: Blueprint):
    """Register project-related routes."""

    @blueprint.route('/messagebox', methods=['POST'])
    @cross_origin(expose_headers='Location')
    @authenticate()
    @validate_request
    def create_project():
        message_box_request = MessageBoxRequest(**request.get_json())
        response = MessageBoxRequestHandler().handle(request=message_box_request)

        if isinstance(response, ResourceCreated):
            return {}, 201, {'Location': response.location}

        return None, 204

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @authenticate()
    def list_projects():
        return ReadProjectListRequestHandler().handle()

    @blueprint.route('/<project_id>/event-log', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_event_log(project_id: str):
        return ReadProjectEventLogRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/metadata', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_get_metadata(project_id: str):
        return ReadProjectMetadataRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/privileges', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_privileges(project_id: str):
        return ReadProjectPrivilegesRequestHandler().handle(project_id=ProjectId.from_str(project_id))
