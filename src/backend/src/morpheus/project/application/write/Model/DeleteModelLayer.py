import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents import ModelLayerDeletedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.layers.Layer import LayerId


class DeleteModelLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str


@dataclasses.dataclass(frozen=True)
class DeleteModelLayerCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: DeleteModelLayerCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.new(),
            layer_id=LayerId.from_str(payload['layer_id']),
        )


class DeleteModelLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: DeleteModelLayerCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        event = ModelLayerDeletedEvent.from_layer_id(
            project_id=project_id,
            model_id=command.model_id,
            layer_id=command.layer_id,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
