import dataclasses

from ...infrastructure.persistence.ProjectRepository import project_repository
from ...types.Project import ProjectId, Project
from ...types.User import UserId
from ...types.Metadata import Metadata, Description, Name, Tags


@dataclasses.dataclass(frozen=True)
class CreateProjectCommand:
    project_id: ProjectId
    name: Name
    description: Description
    tags: Tags
    user_id: UserId


class CreateProjectCommandHandler:

    @staticmethod
    def handle(command: CreateProjectCommand):
        project = Project.new(user_id=command.user_id, project_id=command.project_id)
        metadata = Metadata(name=command.name, description=command.description, tags=command.tags, )
        project = project.with_updated_metadata(metadata)
        project_repository.save_project(project)
