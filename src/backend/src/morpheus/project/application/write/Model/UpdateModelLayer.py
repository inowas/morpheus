import dataclasses
from typing import TypedDict, Literal, Optional

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents import ModelLayerUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.layers.Layer import LayerName, LayerDescription, LayerType, LayerId


class UpdateModelLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    name: Optional[str]
    description: Optional[str]
    type: Optional[Literal['confined', 'convertible', 'unconfined']]


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId
    layer_name: Optional[LayerName]
    layer_description: Optional[LayerDescription]
    layer_type: Optional[LayerType]

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerCommandPayload):
        layer_type_string = payload['type']
        layer_type = LayerType.from_str(layer_type_string) if layer_type_string else None
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.from_str(payload['layer_id']),
            layer_name=LayerName.from_str(payload['name']) if payload['name'] else None,
            layer_description=LayerDescription.from_str(payload['description']) if payload['description'] else None,
            layer_type=layer_type,
        )


class UpdateModelLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        event = ModelLayerUpdatedEvent.from_props(
            project_id=project_id,
            model_id=command.model_id,
            layer_id=command.layer_id,
            layer_name=command.layer_name,
            layer_description=command.layer_description,
            layer_type=command.layer_type,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
