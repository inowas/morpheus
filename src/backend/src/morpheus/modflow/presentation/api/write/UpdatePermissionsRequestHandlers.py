from typing import TypedDict, Literal

from flask import Request, abort

import morpheus.modflow.application.write.UpdatePermissions as UpdatePermissions

from ....incoming import get_logged_in_user_id
from ....types.Permissions import Visibility
from ....types.Project import ProjectId
from ....types.User import UserId


class UpdateOwnerRequest(TypedDict, total=True):
    new_owner_id: str


class UpdateOwnerRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        update_owner_request: UpdateOwnerRequest = request.json  # type: ignore

        if 'new_owner_id' not in update_owner_request:
            abort(400, 'Missing new_owner_id in request body')

        new_owner_id = UserId.from_str(update_owner_request['new_owner_id'])

        command = UpdatePermissions.UpdateOwnerCommand(
            project_id=project_id,
            new_owner_id=new_owner_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdatePermissions.UpdateOwnerCommandHandler.handle(command=command)
        return None, 204


class AddAdminUserRequest(TypedDict, total=True):
    new_admin_id: str


class AddAdminUserRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        add_admin_user_request: AddAdminUserRequest = request.json  # type: ignore

        if 'new_admin_id' not in add_admin_user_request:
            abort(400, 'Missing new_admin_id in request body')

        new_admin_id = UserId.from_str(add_admin_user_request['new_admin_id'])

        command = UpdatePermissions.AddAdminUserCommand(
            project_id=project_id,
            new_admin_id=new_admin_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdatePermissions.AddAdminUserCommandHandler.handle(command=command)
        return None, 204


class RemoveAdminUserRequest(TypedDict, total=True):
    admin_id: str


class RemoveAdminUserRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        remove_admin_user_request: RemoveAdminUserRequest = request.json  # type: ignore

        if 'admin_id' not in remove_admin_user_request:
            abort(400, 'Missing admin_id in request body')

        admin_id = UserId.from_str(remove_admin_user_request['admin_id'])

        command = UpdatePermissions.RemoveAdminUserCommand(
            project_id=project_id,
            admin_id=admin_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdatePermissions.RemoveAdminUserCommandHandler.handle(command=command)
        return None, 204


class AddEditorUserRequest(TypedDict, total=True):
    new_editor_id: str


class AddEditorUserRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        add_editor_request: AddEditorUserRequest = request.json  # type: ignore

        if 'new_editor_id' not in add_editor_request:
            abort(400, 'Missing new_editor_id in request body')

        new_editor_id = UserId.from_str(add_editor_request['new_editor_id'])

        command = UpdatePermissions.AddEditorUserCommand(
            project_id=project_id,
            new_editor_id=new_editor_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdatePermissions.AddEditorUserCommandHandler.handle(command=command)
        return None, 204


class RemoveEditorUserRequest(TypedDict, total=False):
    editor_id: str


class RemoveEditorUserRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        remove_editor_user_request: RemoveEditorUserRequest = request.json  # type: ignore

        if 'editor_id' not in remove_editor_user_request:
            abort(400, 'Missing editor_id in request body')

        editor_id = UserId.from_str(remove_editor_user_request['editor_id'])

        command = UpdatePermissions.RemoveEditorUserCommand(
            project_id=project_id,
            editor_id=editor_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdatePermissions.RemoveEditorUserCommandHandler.handle(command=command)
        return None, 204


class AddObserverUserRequest(TypedDict, total=False):
    new_observer_id: str


class AddObserverUserRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        add_observer_request: AddObserverUserRequest = request.json  # type: ignore

        if 'new_observer_id' not in add_observer_request:
            abort(400, 'Missing new_observer_id in request body')

        new_observer_id = UserId.from_str(add_observer_request['new_observer_id'])

        command = UpdatePermissions.AddObserverUserCommand(
            project_id=project_id,
            new_observer_id=new_observer_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdatePermissions.AddObserverUserCommandHandler.handle(command=command)
        return None, 204


class RemoveObserverUserRequest(TypedDict, total=False):
    observer_id: str


class RemoveObserverUserRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_url_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        current_user_id = get_logged_in_user_id()
        if current_user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)
        remove_observer_request: RemoveObserverUserRequest = request.json  # type: ignore

        if 'observer_id' not in remove_observer_request:
            abort(400, 'Missing observer_id in request body')

        observer_id = UserId.from_str(remove_observer_request['observer_id'])

        command = UpdatePermissions.RemoveObserverUserCommand(
            project_id=project_id,
            observer_id=observer_id,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdatePermissions.RemoveObserverUserCommandHandler.handle(command=command)
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

        command = UpdatePermissions.UpdateVisibilityCommand(
            project_id=project_id,
            visibility=visibility,
            current_user_id=UserId.from_str(current_user_id)
        )

        UpdatePermissions.UpdateVisibilityCommandHandler.handle(command=command)
        return None, 204
