import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.GeneralModelEvents import VersionDescriptionUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.ModelVersion import VersionId, VersionDescription
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId


class UpdateModelVersionDescriptionCommandPayload(TypedDict):
    project_id: str
    version_id: str
    version_description: str


@dataclasses.dataclass(frozen=True)
class UpdateModelVersionDescriptionCommand(ProjectCommandBase):
    version_id: VersionId
    version_description: VersionDescription

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelVersionDescriptionCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            version_id=VersionId.from_str(payload['version_id']),
            version_description=VersionDescription.from_str(payload['version_description']),
        )


class UpdateModelVersionDescriptionCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelVersionDescriptionCommand):
        project_id = command.project_id
        user_id = command.user_id

        event = VersionDescriptionUpdatedEvent.from_version_id(project_id=project_id, version_id=command.version_id, description=command.version_description,
                                                               occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
