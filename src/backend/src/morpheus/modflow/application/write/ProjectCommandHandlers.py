import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope, OccurredAt
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata

from ...domain.events.ProjectEvents import ProjectCreatedEvent, ProjectMetadataUpdatedEvent
from ...infrastructure.event_sourcing.ModflowEventBus import modflow_event_bus
from ...types.Project import ProjectId, Project, Description, Name, Tags
from ...types.User import UserId


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
        metadata = project.metadata.with_updated_name(command.name).with_updated_description(command.description).with_updated_tags(command.tags)
        project = project.with_updated_metadata(metadata)

        event = ProjectCreatedEvent.from_project(project=project)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.created_by.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata, occurred_at=OccurredAt.now())
        modflow_event_bus.record(event_envelope=envelope)


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

        event = ProjectMetadataUpdatedEvent.from_props(project_id=project_id, name=command.name, description=command.description, tags=command.tags)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.updated_by.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata, occurred_at=OccurredAt.now())
        modflow_event_bus.record(event_envelope=envelope)
