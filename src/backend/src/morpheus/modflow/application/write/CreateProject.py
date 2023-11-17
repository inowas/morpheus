import dataclasses

from ...infrastructure.persistence.ProjectRepository import ProjectRepository
from ...types.Project import ProjectId, Project
from ...types.User import UserId
from ...types.Metadata import Metadata, Description, Name, Tags


@dataclasses.dataclass(frozen=True)
class CreateProjectCommand:
    name: Name
    description: Description
    tags: Tags
    user_id: UserId


@dataclasses.dataclass(frozen=True)
class CreateProjectCommandResult:
    project_id: ProjectId


class CreateProjectCommandHandler:

    @staticmethod
    def handle(command: CreateProjectCommand):
        project = Project.new(command.user_id)
        metadata = Metadata(name=command.name, description=command.description, tags=command.tags, )
        project = project.with_updated_metadata(metadata)

        repository = ProjectRepository()
        repository.save_project(project)

        return CreateProjectCommandResult(project_id=project.project_id)
