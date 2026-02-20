import dataclasses
from typing import Literal, TypedDict

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelLayerEvents import ModelLayerCreatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.layers.Layer import Layer, LayerConfinement, LayerDescription, LayerId, LayerName, LayerProperties
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId


class CreateModelLayerCommandPayload(TypedDict):
    project_id: str
    model_id: str
    name: str
    description: str
    confinement: Literal['confined', 'convertible', 'unconfined']
    hk: float
    hani: float
    vka: float
    specific_storage: float
    specific_yield: float
    initial_head: float
    top: float | None
    bottom: float


@dataclasses.dataclass(frozen=True)
class CreateModelLayerCommand(ProjectCommandBase):
    model_id: ModelId
    layer_id: LayerId
    name: LayerName
    description: LayerDescription
    confinement: LayerConfinement
    properties: LayerProperties

    @classmethod
    def from_payload(cls, user_id: UserId, payload: CreateModelLayerCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.new(),
            name=LayerName.from_str(payload['name']),
            description=LayerDescription.from_str(payload['description']),
            confinement=LayerConfinement.from_str(payload['confinement']),
            properties=LayerProperties.from_values(
                hk=payload['hk'],
                hani=payload['hani'],
                vka=payload['vka'],
                specific_storage=payload['specific_storage'],
                specific_yield=payload['specific_yield'],
                initial_head=payload['initial_head'],
                top=payload['top'],
                bottom=payload['bottom'],
            ),
        )


class CreateModelLayerCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: CreateModelLayerCommand):
        project_id = command.project_id
        user_id = command.user_id

        event = ModelLayerCreatedEvent.from_layer(
            project_id=project_id,
            model_id=command.model_id,
            layer=Layer(layer_id=command.layer_id, name=command.name, description=command.description, confinement=command.confinement, properties=command.properties),
            occurred_at=DateTime.now(),
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
