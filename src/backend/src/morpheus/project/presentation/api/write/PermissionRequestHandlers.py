import dataclasses
from typing import Literal, TypedDict

from flask import Request, abort

from ....application.write.PermissionsCommandHandlers import UpdateVisibilityCommand, UpdateVisibilityCommandHandler, AddMemberCommand, \
    AddMemberCommandHandler, RemoveMemberCommand, RemoveMemberCommandHandler, UpdateMemberRoleCommand, UpdateMemberRoleCommandHandler
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
    new_member_role: Literal['owner', 'admin', 'editor', 'viewer']


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

        if 'new_member_role' not in add_member_request:
            abort(400, 'Missing new_member_role in request body')

        new_member_id = UserId.from_str(add_member_request['new_member_id'])
        new_member_role = Role.from_str(add_member_request['new_member_role'])

        command = AddMemberCommand(
            project_id=project_id,
            new_member_id=new_member_id,
            current_user_id=UserId.from_str(current_user_id),
            new_member_role=new_member_role
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

        command = UpdateMemberRoleCommand(
            project_id=project_id,
            member_id=member_id,
            role=role,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdateMemberRoleCommandHandler.handle(command=command)
        return None, 204
