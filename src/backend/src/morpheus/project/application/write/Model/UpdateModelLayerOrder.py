import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents import ModelLayerOrderUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.layers.Layer import LayerId


class UpdateModelLayerOrderPayload(TypedDict):
    project_id: str
    model_id: str
    layer_ids: list[str]


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerOrderCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_ids: list[LayerId]

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerOrderPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_ids=[LayerId.from_str(layer_id) for layer_id in payload['layer_ids']]
        )


class UpdateModelLayerOrderCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerOrderCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        model = ModelReader().get_latest_model(project_id=project_id)
        if model.model_id != command.model_id:
            raise ValueError(f'Model with id {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        model.layers.assert_order_can_be_updated(layer_ids=command.layer_ids)

        event = ModelLayerOrderUpdatedEvent.from_layer_ids(
            project_id=project_id,
            model_id=command.model_id,
            layer_ids=command.layer_ids,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
