import dataclasses
from typing import TypedDict, Optional

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelLayerEvents import ModelLayerMetadataUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.layers.Layer import LayerName, LayerDescription, LayerId


class UpdateModelLayerMetadataCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    name: Optional[str]
    description: Optional[str]


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerMetadataCommand(ProjectCommandBase):
    model_id: ModelId
    layer_id: LayerId
    layer_name: Optional[LayerName]
    layer_description: Optional[LayerDescription]

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerMetadataCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.from_str(payload['layer_id']),
            layer_name=LayerName.from_str(payload['name']) if 'name' in payload and payload['name'] else None,
            layer_description=LayerDescription.from_str(payload['description']) if 'description' in payload and payload['description'] else None,
        )


class UpdateModelLayerMetadataCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerMetadataCommand):
        project_id = command.project_id
        user_id = command.user_id

        event = ModelLayerMetadataUpdatedEvent.from_props(
            project_id=project_id,
            model_id=command.model_id,
            layer_id=command.layer_id,
            layer_name=command.layer_name,
            layer_description=command.layer_description,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
