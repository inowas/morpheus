import dataclasses
from typing import Literal, TypedDict

from flask import Request, abort

from ....application.write import PermissionCommands, PermissionCommandHandlers
from ....incoming import get_logged_in_user_id
from ....types.Permissions import Visibility, Role
from ....types.Project import ProjectId
from ....types.User import UserId


@dataclasses.dataclass(frozen=True)
class UpdateVisibilityRequest(TypedDict, total=False):
    visibility: Literal['public', 'private']


class UpdateVisibilityRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        project_id = ProjectId.from_str(project_id_url_parameter)
        update_visibility_request: UpdateVisibilityRequest = request.json  # type: ignore

        if 'visibility' not in update_visibility_request:
            abort(400, 'Missing visibility in request body')

        visibility = Visibility.from_str(update_visibility_request['visibility'])

        command = PermissionCommands.UpdateVisibilityCommand.new(
            project_id=project_id,
            user_id=user_id,
            visibility=visibility,
        )

        PermissionCommandHandlers.UpdateVisibilityCommandHandler.handle(command=command)
        return None, 204


class AddMemberRequest(TypedDict, total=False):
    new_member_id: str
    new_member_role: Literal['owner', 'admin', 'editor', 'viewer']


class AddMemberRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        project_id = ProjectId.from_str(project_id_url_parameter)
        add_member_request: AddMemberRequest = request.json  # type: ignore

        if 'new_member_id' not in add_member_request:
            abort(400, 'Missing new_member_id in request body')

        if 'new_member_role' not in add_member_request:
            abort(400, 'Missing new_member_role in request body')

        new_member_id = UserId.from_str(add_member_request['new_member_id'])
        new_member_role = Role.from_str(add_member_request['new_member_role'])

        command = PermissionCommands.AddMemberCommand.new(
            project_id=project_id,
            user_id=user_id,
            new_member_id=new_member_id,
            new_member_role=new_member_role
        )

        PermissionCommandHandlers.AddMemberCommandHandler.handle(command=command)
        return None, 204


class RemoveMemberRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str, user_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        project_id = ProjectId.from_str(project_id_url_parameter)
        member_id = UserId.from_str(user_id_url_parameter)

        command = PermissionCommands.RemoveMemberCommand.new(
            project_id=project_id,
            user_id=user_id,
            member_id=member_id,
        )

        PermissionCommandHandlers.RemoveMemberCommandHandler.handle(command=command)
        return None, 204


class UpdateMemberRoleRequest(TypedDict, total=False):
    role: Literal['owner', 'admin', 'editor', 'viewer']


class UpdateMemberRoleRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str, user_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        project_id = ProjectId.from_str(project_id_url_parameter)
        member_id = UserId.from_str(user_id_url_parameter)

        update_member_request: UpdateMemberRoleRequest = request.json  # type: ignore
        if 'role' not in update_member_request:
            abort(400, 'Missing role in request body')

        role = Role.from_str(update_member_request['role'])

        command = PermissionCommands.UpdateMemberRoleCommand.new(
            project_id=project_id,
            member_id=member_id,
            new_role=role,
            user_id=user_id,
        )

        PermissionCommandHandlers.UpdateMemberRoleCommandHandler.handle(command=command)
        return None, 204
