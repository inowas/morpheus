import dataclasses

from ...infrastructure.persistence.ProjectRepository import project_repository
from ...types.Permissions import Visibility
from ...types.Project import ProjectId
from ...types.User import UserId


@dataclasses.dataclass(frozen=True)
class AddAdminUserCommand:
    project_id: ProjectId
    user_id: UserId
    current_user_id: UserId


@dataclasses.dataclass
class AddAdminUserCommandResult:
    pass


class AddAdminUserCommandHandler:
    @staticmethod
    def handle(command: AddAdminUserCommand):
        project_id = command.project_id
        user_id = command.user_id

        permissions = project_repository.get_project_permissions(project_id)
        if permissions is None:
            raise Exception(f'Could not find project with id {project_id.to_str()}')

        if user_id not in permissions.admin:
            permissions.admin.append(user_id)
            project_repository.update_project_permissions(project_id, permissions)

        return AddAdminUserCommandResult()


@dataclasses.dataclass(frozen=True)
class RemoveAdminUserCommand:
    project_id: ProjectId
    user_id: UserId


@dataclasses.dataclass
class RemoveAdminUserCommandResult:
    pass


class RemoveAdminUserCommandHandler:
    @staticmethod
    def handle(command: RemoveAdminUserCommand):
        project_id = command.project_id
        user_id = command.user_id

        permissions = project_repository.get_project_permissions(project_id)
        if permissions is None:
            raise Exception(f'Could not find project with id {project_id.to_str()}')

        if user_id in permissions.admin:
            permissions.admin.remove(user_id)
            project_repository.update_project_permissions(project_id, permissions)

        return RemoveAdminUserCommandResult()


@dataclasses.dataclass(frozen=True)
class UpdateVisibilityCommand:
    project_id: ProjectId
    visibility: Visibility


@dataclasses.dataclass
class UpdateVisibilityCommandResult:
    pass


class UpdateVisibilityCommandHandler:
    @staticmethod
    def handle(command: UpdateVisibilityCommand):
        project_id = command.project_id

        permissions = project_repository.get_project_permissions(project_id)
        if permissions is None:
            raise Exception(f'Could not find project with id {project_id.to_str()}')

        return UpdateVisibilityCommandResult()
