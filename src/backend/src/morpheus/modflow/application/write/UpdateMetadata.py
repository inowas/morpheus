import dataclasses

from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from ...infrastructure.persistence.ProjectRepository import project_repository
from ...types.Metadata import Description, Name, Tags
from ...types.Permissions import Permissions
from ...types.Project import ProjectId
from ...types.User import UserId


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

        permissions = project_repository.get_project_permissions(project_id)

        if not isinstance(permissions, Permissions):
            raise NotFoundException(f'Could not find project with id {project_id.to_str()}')

        if not permissions.user_can_edit(command.updated_by):
            raise InsufficientPermissionsException(
                f'User {command.updated_by.to_str()} does not have permission to edit metadata {project_id.to_str()}')

        metadata = project_repository.get_project_metadata(project_id)
        if metadata is None:
            raise Exception(f'Could not find project with id {project_id.to_str()}')

        if command.name is not None:
            metadata = metadata.with_updated_name(command.name) if metadata.name is not None else metadata

        if command.description is not None:
            metadata = metadata.with_updated_description(command.description)

        if command.tags is not None:
            metadata = metadata.with_updated_tags(command.tags)

        project_repository.update_project_metadata(project_id, metadata)
