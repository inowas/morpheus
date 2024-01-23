import dataclasses

from morpheus.common.types import DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from ...domain.events.ProjectCreatedEvent import ProjectCreatedEvent
from ...infrastructure.event_sourcing.ModflowEventBus import modflow_event_bus
from ...infrastructure.persistence.ProjectRepository import project_repository
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

        event = ProjectCreatedEvent.from_project(project)
        event_envelope = EventEnvelope(event=event, metadata={'created_by': command.created_by}, occurred_at=DateTime.now())

        modflow_event_bus.record(event_envelope)
