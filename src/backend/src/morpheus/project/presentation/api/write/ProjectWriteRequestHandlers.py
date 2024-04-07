import dataclasses
from typing import TypedDict
from flask import Request, abort
from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from ....application.read.ProjectReader import project_reader
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

        create_model_request = CreateProjectRequest.from_dict(obj=request.json)
        name = Name.from_str(create_model_request.name)
        description = Description.from_str(create_model_request.description)
        tags = Tags.from_list(create_model_request.tags)

        command = CreateProjectCommand(
            project_id=ProjectId.new(),
            name=name,
            description=description,
            tags=tags,
            created_by=UserId.from_str(user_id)
        )

        CreateProjectCommandHandler.handle(command=command)

        return '', 201, {'location': f'projects/{command.project_id.to_str()}'}


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

        user_id = UserId.try_from_str(get_logged_in_user_id())
        if user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        if not project_reader.project_exists(project_id):
            abort(404, f'Project with id {project_id.to_str()} does not exist')

        update_model_metadata = UpdateMetadataRequest.from_dict(obj=request.json)

        name = None
        if update_model_metadata.name is not None:
            name = Name.from_str(update_model_metadata.name)

        description = None
        if update_model_metadata.description is not None:
            description = Description.from_str(update_model_metadata.description)

        tags = None
        if update_model_metadata.tags is not None:
            tags = Tags.from_list(update_model_metadata.tags)

        command = UpdateMetadataCommand(
            project_id=project_id,
            name=name,
            description=description,
            tags=tags,
            updated_by=user_id
        )

        try:
            UpdateMetadataCommandHandler.handle(command=command)
        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))

        return '', 204
