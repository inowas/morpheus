import dataclasses

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from ...infrastructure.persistence.ProjectRepository import project_repository
from ...types.Permissions import Visibility, Permissions
from ...types.Project import ProjectId
from ...types.User import UserId


@dataclasses.dataclass(frozen=True)
class UpdateOwnerCommand:
    project_id: ProjectId
    new_owner_id: UserId
    current_user_id: UserId


class UpdateOwnerCommandHandler:
    @staticmethod
    def handle(command: UpdateOwnerCommand):
        project_id = command.project_id
        new_owner_id = command.new_owner_id
        current_user_id = command.current_user_id

        permissions = project_repository.get_project_permissions(project_id)
        if not isinstance(permissions, Permissions):
            raise NotFoundException(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_manage_owner_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to '
                                                   f'update owner of project {project_id.to_str()}')

        if permissions.owner_id == new_owner_id:
            return

        permissions = permissions.with_updated_owner(new_owner_id)
        project_repository.update_project_permissions(project_id, permissions)


@dataclasses.dataclass(frozen=True)
class AddAdminUserCommand:
    project_id: ProjectId
    new_admin_id: UserId
    current_user_id: UserId


class AddAdminUserCommandHandler:
    @staticmethod
    def handle(command: AddAdminUserCommand):
        project_id = command.project_id
        new_admin_id = command.new_admin_id
        current_user_id = command.current_user_id

        permissions = project_repository.get_project_permissions(project_id)
        if not isinstance(permissions, Permissions):
            raise NotFoundException(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_manage_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to '
                                                   f'update admin of project {project_id.to_str()}')

        if new_admin_id in permissions.admin_ids:
            return

        permissions = permissions.with_added_admin(new_admin_id)
        project_repository.update_project_permissions(project_id, permissions)


@dataclasses.dataclass(frozen=True)
class RemoveAdminUserCommand:
    project_id: ProjectId
    admin_id: UserId
    current_user_id: UserId


class RemoveAdminUserCommandHandler:
    @staticmethod
    def handle(command: RemoveAdminUserCommand):
        project_id = command.project_id
        admin_id = command.admin_id
        current_user_id = command.current_user_id

        permissions = project_repository.get_project_permissions(project_id=project_id)
        if not isinstance(permissions, Permissions):
            raise NotFoundException(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_manage_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to '
                                                   f'update admin of project {project_id.to_str()}')

        if admin_id not in permissions.admin_ids:
            return

        permissions = permissions.with_removed_admin(user_id=admin_id)
        project_repository.update_project_permissions(project_id, permissions)


@dataclasses.dataclass(frozen=True)
class AddEditorUserCommand:
    project_id: ProjectId
    new_editor_id: UserId
    current_user_id: UserId


class AddEditorUserCommandHandler:
    @staticmethod
    def handle(command: AddEditorUserCommand):
        project_id = command.project_id
        new_editor_id = command.new_editor_id
        current_user_id = command.current_user_id

        permissions = project_repository.get_project_permissions(project_id)
        if not isinstance(permissions, Permissions):
            raise NotFoundException(f'Could not find project with id {project_id.to_str()}')

        if not isinstance(permissions, Permissions):
            raise Exception(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_manage_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to '
                                                   f'update editor of project {project_id.to_str()}')

        if new_editor_id in permissions.editor_ids:
            return

        permissions = permissions.with_added_editor(new_editor_id)
        project_repository.update_project_permissions(project_id, permissions)


@dataclasses.dataclass(frozen=True)
class RemoveEditorUserCommand:
    project_id: ProjectId
    editor_id: UserId
    current_user_id: UserId


class RemoveEditorUserCommandHandler:
    @staticmethod
    def handle(command: RemoveEditorUserCommand):
        project_id = command.project_id
        editor_id = command.editor_id
        current_user_id = command.current_user_id

        permissions = project_repository.get_project_permissions(project_id)
        if not isinstance(permissions, Permissions):
            raise NotFoundException(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_manage_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to '
                                                   f'update editor of project {project_id.to_str()}')

        if editor_id not in permissions.editor_ids:
            return

        permissions = permissions.with_removed_editor(user_id=editor_id)
        project_repository.update_project_permissions(project_id, permissions)


@dataclasses.dataclass(frozen=True)
class AddObserverUserCommand:
    project_id: ProjectId
    new_observer_id: UserId
    current_user_id: UserId


class AddObserverUserCommandHandler:
    @staticmethod
    def handle(command: AddObserverUserCommand):
        project_id = command.project_id
        new_observer_id = command.new_observer_id
        current_user_id = command.current_user_id

        permissions = project_repository.get_project_permissions(project_id)
        if not isinstance(permissions, Permissions):
            raise NotFoundException(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_manage_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to '
                                                   f'update observer of project {project_id.to_str()}')

        if new_observer_id in permissions.observer_ids:
            return

        permissions = permissions.with_added_observer(new_observer_id)
        project_repository.update_project_permissions(project_id, permissions)


@dataclasses.dataclass(frozen=True)
class RemoveObserverUserCommand:
    project_id: ProjectId
    observer_id: UserId
    current_user_id: UserId


class RemoveObserverUserCommandHandler:
    @staticmethod
    def handle(command: RemoveObserverUserCommand):
        project_id = command.project_id
        old_observer_id = command.observer_id
        current_user_id = command.current_user_id

        permissions = project_repository.get_project_permissions(project_id)
        if not isinstance(permissions, Permissions):
            raise NotFoundException(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_manage_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to '
                                                   f'update observer of project {project_id.to_str()}')

        if old_observer_id not in permissions.observer_ids:
            return

        permissions = permissions.with_removed_observer(user_id=old_observer_id)
        project_repository.update_project_permissions(project_id, permissions)


@dataclasses.dataclass(frozen=True)
class UpdateVisibilityCommand:
    project_id: ProjectId
    visibility: Visibility
    current_user_id: UserId


class UpdateVisibilityCommandHandler:
    @staticmethod
    def handle(command: UpdateVisibilityCommand):
        project_id = command.project_id

        permissions = project_repository.get_project_permissions(project_id)
        if permissions is None:
            raise Exception(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_manage_visibility(command.current_user_id):
            raise InsufficientPermissionsException(
                f'User {command.current_user_id.to_str()} does not have permission to '
                f'update visibility of project {project_id.to_str()}')

        permissions = permissions.with_updated_visibility(command.visibility)
        project_repository.update_project_permissions(project_id, permissions)
