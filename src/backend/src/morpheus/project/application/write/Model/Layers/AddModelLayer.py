import dataclasses
from typing import TypedDict

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelLayerEvents import ModelLayerAddedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.layers import Layer
from morpheus.project.types.layers.Layer import LayerName, LayerPropertyDefaultValue
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId


class AddModelLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str


@dataclasses.dataclass(frozen=True)
class AddModelLayerCommand(ProjectCommandBase):
    model_id: ModelId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: AddModelLayerCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
        )


class AddModelLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: AddModelLayerCommand):
        project_id = command.project_id
        user_id = command.user_id

        model = ModelReader().get_latest_model(project_id=project_id)
        if model.model_id != command.model_id:
            raise ValueError(f'Model with id {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        layer = Layer.from_default()
        try:
            layer.name = LayerName(value=f'Layer {len(model.layers) + 1}')
            layer.properties.bottom.value = LayerPropertyDefaultValue(value=float(model.layers[-1].properties.bottom.min() - 1))
        except:  # noqa: E722
            pass

        model.layers.assert_layer_can_be_added(layer=layer)

        event = ModelLayerAddedEvent.from_layer(project_id=project_id, model_id=command.model_id, layer=layer, occurred_at=DateTime.now())

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
