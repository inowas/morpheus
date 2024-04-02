import dataclasses
from typing import TypedDict
from flask import Request, Response, abort

from morpheus.common.presentation.helpers.file_upload import remove_uploaded_file, move_uploaded_file_to_tmp_dir
from morpheus.common.types.Exceptions import NotFoundException
from ....application.write import ProjectCommands, ProjectCommandHandlers
from ....incoming import get_logged_in_user_id
from ....types.Asset import AssetId
from ....types.Exceptions import InvalidMimeTypeException
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

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        create_model_request = CreateProjectRequest.from_dict(obj=request.json)
        name = Name.from_str(create_model_request.name)
        description = Description.from_str(create_model_request.description)
        tags = Tags.from_list(create_model_request.tags)

        command = ProjectCommands.CreateProjectCommand.new(
            project_id=ProjectId.new(),
            name=name,
            description=description,
            tags=tags,
            user_id=user_id,
        )

        ProjectCommandHandlers.CreateProjectCommandHandler.handle(command=command)

        return Response(status=201, headers={'Location': f'/projects/{command.project_id.to_str()}'})


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

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        project_id = ProjectId.from_str(project_id_url_parameter)
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

        command = ProjectCommands.UpdateProjectMetadataCommand.new(
            project_id=project_id,
            name=name,
            description=description,
            tags=tags,
            user_id=user_id,
        )

        ProjectCommandHandlers.UpdateProjectMetadataCommandHandler.handle(command=command)
        return Response(status=204)


class UploadPreviewImageRequestHandler:
    @staticmethod
    def handle(request: Request, project_id: str):

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        file_name, file_path = move_uploaded_file_to_tmp_dir('file', request)

        try:
            command = ProjectCommands.UpdateProjectPreviewImageCommand.new(
                project_id=ProjectId.from_str(project_id),
                asset_id=AssetId.new(),
                file_name=file_name,
                file_path=file_path,
                user_id=user_id,
            )

            ProjectCommandHandlers.UpdatePreviewImageCommandHandler.handle(command)
        except NotFoundException as e:
            abort(404, str(e))
        except InvalidMimeTypeException as e:
            abort(422, str(e))
        finally:
            remove_uploaded_file(file_path)

        return Response(status=204)
