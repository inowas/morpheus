import dataclasses

from ...infrastructure.persistence.ProjectRepository import project_repository
from ...types.Metadata import Description, Name, Tags
from ...types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class UpdateMetadataCommand:
    project_id: ProjectId
    name: Name | None
    description: Description | None
    tags: Tags | None


@dataclasses.dataclass
class UpdateMetadataCommandResult:
    pass


class UpdateMetadataCommandHandler:
    @staticmethod
    def handle(command: UpdateMetadataCommand):
        project_id = command.project_id

        metadata = project_repository.get_project_metadata(project_id)
        if metadata is None:
            raise Exception(f'Could not find project with id {project_id.to_str()}')

        if command.name is not None:
            metadata = metadata.with_updated_name(command.name)

        if command.description is not None:
            metadata = metadata.with_updated_description(command.description)

        if command.tags is not None:
            metadata = metadata.with_updated_tags(command.tags)

        project_repository.update_project_metadata(project_id, metadata)

        return UpdateMetadataCommandResult()
