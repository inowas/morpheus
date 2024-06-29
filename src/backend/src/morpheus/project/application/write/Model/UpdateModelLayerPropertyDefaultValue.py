import dataclasses
from typing import TypedDict, Literal

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelLayerEvents import ModelLayerPropertyUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.layers.Layer import LayerId, LayerPropertyName, LayerPropertyDefaultValue


class UpdateModelLayerPropertyDefaultValueCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    property_name: Literal['hk', 'hani', 'vka', 'specific_storage', 'specific_yield', 'initial_head', 'top', 'bottom']
    property_default_value: float


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerPropertyDefaultValueCommand(ProjectCommandBase):
    model_id: ModelId
    layer_id: LayerId
    property_name: LayerPropertyName
    property_default_value: LayerPropertyDefaultValue

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerPropertyDefaultValueCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.from_str(payload['layer_id']),
            property_name=LayerPropertyName(payload['property_name']),
            property_default_value=LayerPropertyDefaultValue(payload['property_default_value']),
        )


class UpdateModelLayerPropertyDefaultValueCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerPropertyDefaultValueCommand):
        project_id = command.project_id
        user_id = command.user_id

        property_default_value = command.property_default_value

        event = ModelLayerPropertyUpdatedEvent.from_default_value(
            project_id=project_id,
            model_id=command.model_id,
            layer_id=command.layer_id,
            property_name=command.property_name,
            property_default_value=property_default_value,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
