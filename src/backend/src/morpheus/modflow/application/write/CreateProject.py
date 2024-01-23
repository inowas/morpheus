import dataclasses

from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope, OccurredAt
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata

from ...domain.events.ProjectCreatedEvent import ProjectCreatedEvent
from ...infrastructure.event_sourcing.ModflowEventBus import modflow_event_bus
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
        settings = project.settings.with_updated_metadata(Metadata(name=command.name, description=command.description, tags=command.tags))
        project = project.with_updated_settings(settings)

        event = ProjectCreatedEvent.from_project(project=project)
        event_metadata = EventMetadata(obj={'created_by': command.created_by.to_str()})
        occurred_at = OccurredAt.now()
        envelope = EventEnvelope(event=event, metadata=event_metadata, occurred_at=occurred_at)
        modflow_event_bus.record(event_envelope=envelope)
