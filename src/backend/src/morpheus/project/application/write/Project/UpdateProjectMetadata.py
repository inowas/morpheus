import dataclasses
from typing import TypedDict, List, Optional

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.domain.events.ProjectEvents.ProjectEvents import ProjectMetadataUpdatedEvent
from morpheus.project.types.Project import ProjectId, Name, Description, Tags
from morpheus.project.types.User import UserId


class UpdateProjectMetadataPayload(TypedDict):
    project_id: str
    name: Optional[str]
    description: Optional[str]
    tags: Optional[List[str]]


@dataclasses.dataclass(frozen=True)
class UpdateProjectMetadataCommand(CommandBase):
    project_id: ProjectId
    name: Name | None
    description: Description | None
    tags: Tags | None

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateProjectMetadataPayload):
        name_str = payload.get('name')
        name = Name.from_str(name_str) if name_str is not None else None
        description_str = payload.get('description')
        description = Description.from_str(description_str) if description_str is not None else None
        tags_list = payload.get('tags')
        tags = Tags.from_list(tags_list) if tags_list is not None else None

        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            name=name,
            description=description,
            tags=tags,
        )


class UpdateProjectMetadataCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateProjectMetadataCommand) -> None:
        project_id = command.project_id
        if not project_reader.project_exists(project_id):
            raise NotFoundException(f'Project with id {project_id.to_str()} does not exist')

        # todo assert user has access to project
        event = ProjectMetadataUpdatedEvent.from_props(project_id=project_id, name=command.name, description=command.description, tags=command.tags, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
