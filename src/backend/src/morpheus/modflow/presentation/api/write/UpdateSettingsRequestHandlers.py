import dataclasses
from typing import Literal, TypedDict

from flask import Request, abort

from ....application.write.UpdateSettings import UpdateMetadataCommand, UpdateMetadataCommandHandler, UpdateVisibilityCommand, UpdateVisibilityCommandHandler, AddMemberCommand, \
    AddMemberCommandHandler, RemoveMemberCommand, RemoveMemberCommandHandler, UpdateMemberCommand, UpdateMemberCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.Settings import Description, Tags, Name, Visibility, Role
from ....types.Project import ProjectId
from ....types.User import UserId


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


class UpdateVisibilityRequest(TypedDict, total=False):
    visibility: Literal['public', 'private']


class UpdateVisibilityRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        update_visibility_request: UpdateVisibilityRequest = request.json  # type: ignore

        if 'visibility' not in update_visibility_request:
            abort(400, 'Missing visibility in request body')

        visibility = Visibility.from_str(update_visibility_request['visibility'])

        command = UpdateVisibilityCommand(
            project_id=project_id,
            visibility=visibility,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdateVisibilityCommandHandler.handle(command=command)
        return None, 204


class AddMemberRequest(TypedDict, total=False):
    new_member_id: str


class AddMemberRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        add_member_request: AddMemberRequest = request.json  # type: ignore

        if 'new_member_id' not in add_member_request:
            abort(400, 'Missing new_member_id in request body')

        new_member_id = UserId.from_str(add_member_request['new_member_id'])

        command = AddMemberCommand(
            project_id=project_id,
            new_member_id=new_member_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        AddMemberCommandHandler.handle(command=command)
        return None, 204


class RemoveMemberRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str, user_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        member_id = UserId.from_str(user_id_url_parameter)

        command = RemoveMemberCommand(
            project_id=project_id,
            member_id=member_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        RemoveMemberCommandHandler.handle(command=command)
        return None, 204


class UpdateMemberRoleRequest(TypedDict, total=False):
    role: Literal['owner', 'admin', 'editor', 'viewer']


class UpdateMemberRoleRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str, user_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        member_id = UserId.from_str(user_id_url_parameter)

        update_member_request: UpdateMemberRoleRequest = request.json  # type: ignore
        if 'role' not in update_member_request:
            abort(400, 'Missing role in request body')

        role = Role.from_str(update_member_request['role'])

        command = UpdateMemberCommand(
            project_id=project_id,
            member_id=member_id,
            role=role,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdateMemberCommandHandler.handle(command=command)
        return None, 204
