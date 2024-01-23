import dataclasses

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from ...infrastructure.persistence.ProjectRepository import ProjectRepository
from ...types.Project import ProjectId
from ...types.Settings import Settings, Role, Name, Description, Tags, Metadata, Visibility
from ...types.User import UserId


@dataclasses.dataclass(frozen=True)
class AddMemberCommand:
    project_id: ProjectId
    new_member_id: UserId
    current_user_id: UserId


class AddMemberCommandHandler:
    @staticmethod
    def handle(command: AddMemberCommand):
        project_id = command.project_id
        new_member_id = command.new_member_id
        current_user_id = command.current_user_id

        project_repository = ProjectRepository()

        settings = project_repository.get_settings(project_id)
        if not isinstance(settings, Settings):
            raise NotFoundException(f'Could not find Settings for project with id {project_id.to_str()}')

        if not settings.members.member_can_edit_members_and_permissions(new_member_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to add a member to the project {project_id.to_str()}')

        if settings.members.has_member(new_member_id):
            return

        settings = settings.with_updated_members(settings.members.with_added_member(user_id=new_member_id, role=Role.VIEWER))
        project_repository.update_settings(project_id=project_id, settings=settings)


@dataclasses.dataclass(frozen=True)
class UpdateMemberCommand:
    project_id: ProjectId
    member_id: UserId
    role: Role
    current_user_id: UserId


class UpdateMemberCommandHandler:
    @staticmethod
    def handle(command: UpdateMemberCommand):
        project_id = command.project_id
        member_id = command.member_id
        role = command.role
        current_user_id = command.current_user_id

        project_repository = ProjectRepository()

        settings = project_repository.get_settings(project_id)
        if not isinstance(settings, Settings):
            raise NotFoundException(f'Could not find Settings for project with id {project_id.to_str()}')

        if not settings.members.member_can_edit_members_and_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to update a member of the project {project_id.to_str()}')

        if not settings.members.has_member(member_id):
            return

        settings = settings.with_updated_members(settings.members.with_updated_member(user_id=member_id, role=role))
        project_repository.update_settings(project_id=project_id, settings=settings)


@dataclasses.dataclass(frozen=True)
class RemoveMemberCommand:
    project_id: ProjectId
    member_id: UserId
    current_user_id: UserId


class RemoveMemberCommandHandler:
    @staticmethod
    def handle(command: RemoveMemberCommand):
        project_id = command.project_id
        member_id = command.member_id
        current_user_id = command.current_user_id

        project_repository = ProjectRepository()

        settings = project_repository.get_settings(project_id)
        if not isinstance(settings, Settings):
            raise NotFoundException(f'Could not find Settings for project with id {project_id.to_str()}')

        if not settings.members.member_can_edit_members_and_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to remove a member from the project {project_id.to_str()}')

        if not settings.members.has_member(member_id):
            return

        settings = settings.with_updated_members(settings.members.with_removed_member(user_id=member_id))
        project_repository.update_settings(project_id=project_id, settings=settings)


@dataclasses.dataclass(frozen=True)
class UpdateVisibilityCommand:
    project_id: ProjectId
    visibility: Visibility
    current_user_id: UserId


class UpdateVisibilityCommandHandler:
    @staticmethod
    def handle(command: UpdateVisibilityCommand):
        project_id = command.project_id

        project_repository = ProjectRepository()

        settings = project_repository.get_settings(project_id)

        if not isinstance(settings, Settings):
            raise NotFoundException(f'Could not find Settings for project with id {project_id.to_str()}')

        if not settings.members.member_can_edit_visibility(command.current_user_id):
            raise InsufficientPermissionsException(
                f'User {command.current_user_id.to_str()} does not have permission to update visibility of project {project_id.to_str()}')

        settings = settings.with_updated_visibility(command.visibility)
        project_repository.update_settings(project_id=project_id, settings=settings)


@dataclasses.dataclass(frozen=True)
class UpdateMetadataCommand:
    project_id: ProjectId
    name: Name | None
    description: Description | None
    tags: Tags | None
    updated_by: UserId


class UpdateMetadataCommandHandler:
    @staticmethod
    def handle(command: UpdateMetadataCommand) -> None:
        project_id = command.project_id

        project_repository = ProjectRepository()

        settings = project_repository.get_settings(project_id)

        if not isinstance(settings, Settings):
            raise NotFoundException(f'Could not find Settings for project with id {project_id.to_str()}')

        if not settings.members.member_can_edit_metadata(command.updated_by):
            raise InsufficientPermissionsException(
                f'User {command.updated_by.to_str()} does not have permission to edit metadata {project_id.to_str()}')

        metadata = settings.metadata
        if not isinstance(metadata, Metadata):
            raise Exception(f'Could not find metadata in project with with id {project_id.to_str()}')

        metadata = metadata.with_updated_name(command.name) if command.name is not None else metadata
        metadata = metadata.with_updated_description(command.description) if command.description is not None else metadata
        metadata = metadata.with_updated_tags(command.tags) if command.tags is not None else metadata

        settings = settings.with_updated_metadata(metadata)
        project_repository.update_settings(project_id=project_id, settings=settings)
