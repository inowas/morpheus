import dataclasses
from typing import TypedDict

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.GeneralModelEvents import VersionAssignedToModelEvent, VersionCreatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.ModelVersion import ModelVersion, VersionDescription, VersionTag
from morpheus.project.types.Project import ProjectId


class CreateModelVersionCommandPayload(TypedDict):
    project_id: str
    version_tag: str
    version_description: str


@dataclasses.dataclass(frozen=True)
class CreateModelVersionCommand(ProjectCommandBase):
    version_tag: VersionTag
    version_description: VersionDescription

    @classmethod
    def from_payload(cls, user_id: UserId, payload: CreateModelVersionCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            version_tag=VersionTag.from_str(payload['version_tag']),
            version_description=VersionDescription.from_str(payload['version_description']),
        )


class CreateModelVersionCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: CreateModelVersionCommand):
        project_id = command.project_id
        user_id = command.user_id

        version = ModelVersion.new(tag=command.version_tag, description=command.version_description)
        event = VersionCreatedEvent.from_version(project_id=project_id, version=version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = VersionAssignedToModelEvent.from_version(project_id=project_id, version=version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
