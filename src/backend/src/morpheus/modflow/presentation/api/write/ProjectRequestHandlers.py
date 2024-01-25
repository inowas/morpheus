import dataclasses
from typing import TypedDict
from flask import Request, abort, jsonify

from ....application.write.ProjectCommandHandlers import CreateProjectCommand, CreateProjectCommandHandler, UpdateMetadataCommand, UpdateMetadataCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.Project import ProjectId, Description, Tags, Name
from ....types.User import UserId


class PolygonDict(TypedDict, total=True):
    type: str
    coordinates: list[list[list[float]]]


@dataclasses.dataclass
class CreateProjectRequest:
    name: str
    description: str
    tags: list[str]

    @classmethod
    def from_dict(cls, obj):
        return cls(
            name=obj['name'],
            description=obj['description'],
            tags=obj['tags'],
        )


class CreateProjectRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        create_modflow_model_request = CreateProjectRequest.from_dict(obj=request.json)
        name = Name.from_str(create_modflow_model_request.name)
        description = Description.from_str(create_modflow_model_request.description)
        tags = Tags.from_list(create_modflow_model_request.tags)

        command = CreateProjectCommand(
            project_id=ProjectId.new(),
            name=name,
            description=description,
            tags=tags,
            created_by=UserId.from_str(user_id)
        )

        CreateProjectCommandHandler.handle(command=command)
        response = jsonify()
        response.status_code = 201
        response.headers['location'] = f'projects/{command.project_id.to_str()}'

        return response


@dataclasses.dataclass
class UpdateMetadataRequest:
    name: str | None
    description: str | None
    tags: list[str] | None

    @classmethod
    def from_dict(cls, obj):
        return cls(
            name=obj['name'] if 'name' in obj else None,
            description=obj['description'] if 'description' in obj else None,
            tags=obj['tags'] if 'tags' in obj else None,
        )


class UpdateMetadataRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        update_modflow_model_metadata = UpdateMetadataRequest.from_dict(obj=request.json)

        name = None
        if update_modflow_model_metadata.name is not None:
            name = Name.from_str(update_modflow_model_metadata.name)

        description = None
        if update_modflow_model_metadata.description is not None:
            description = Description.from_str(update_modflow_model_metadata.description)

        tags = None
        if update_modflow_model_metadata.tags is not None:
            tags = Tags.from_list(update_modflow_model_metadata.tags)

        command = UpdateMetadataCommand(
            project_id=project_id,
            name=name,
            description=description,
            tags=tags,
            updated_by=UserId.from_str(user_id)
        )

        UpdateMetadataCommandHandler.handle(command=command)
        return None, 204
