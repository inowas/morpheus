import dataclasses

from ...infrastructure.persistence.ProjectRepository import ProjectRepository
from ...types.Project import ProjectId, Project
from ...types.User import UserId
from ...types.Settings import Metadata, Description, Name, Tags


@dataclasses.dataclass(frozen=True)
class CreateProjectCommand:
    project_id: ProjectId
    name: Name
    description: Description
    tags: Tags
    created_by: UserId


class CreateProjectCommandHandler:

    @staticmethod
    def handle(command: CreateProjectCommand):
        project = Project.new(user_id=command.created_by, project_id=command.project_id)
        settings = project.settings
        settings = settings.with_updated_metadata(Metadata(name=command.name, description=command.description, tags=command.tags))
        project = project.with_updated_settings(settings)
        ProjectRepository().save_project(project=project)
