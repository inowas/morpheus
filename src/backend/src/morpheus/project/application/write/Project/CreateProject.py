import dataclasses
from typing import TypedDict, List

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.domain.events.ProjectEvents import ProjectCreatedEvent
from morpheus.project.types.Project import Name, Description, Tags, ProjectId, Project
from morpheus.project.types.User import UserId


class CreateProjectPayload(TypedDict):
    name: str
    description: str
    tags: List[str]


@dataclasses.dataclass(frozen=True)
class CreateProjectCommand(CommandBase):
    project_id: ProjectId
    name: Name
    description: Description
    tags: Tags

    @classmethod
    def from_payload(cls, user_id: UserId, payload: CreateProjectPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.new(),
            name=Name.from_str(payload['name']),
            description=Description.from_str(payload['description']),
            tags=Tags.from_list(payload['tags']),
        )


class CreateProjectCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: CreateProjectCommand):
        project = Project.new(user_id=command.user_id, project_id=command.project_id)
        metadata = project.metadata.with_updated_name(command.name).with_updated_description(command.description).with_updated_tags(command.tags)
        project = project.with_updated_metadata(metadata)

        event = ProjectCreatedEvent.from_project(project=project, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
