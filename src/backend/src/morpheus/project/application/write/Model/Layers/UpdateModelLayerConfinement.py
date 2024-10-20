import dataclasses
from typing import TypedDict, Literal

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelLayerEvents import ModelLayerConfinementUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.layers.Layer import LayerId, LayerConfinement


class UpdateModelLayerConfinementPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    confinement: Literal['confined', 'convertible', 'unconfined']


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerConfinementCommand(ProjectCommandBase):
    model_id: ModelId
    layer_id: LayerId
    confinement: LayerConfinement

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerConfinementPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.from_str(payload['layer_id']),
            confinement=LayerConfinement.from_str(payload['confinement'])
        )


class UpdateModelLayerConfinementCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerConfinementCommand):
        project_id = command.project_id
        user_id = command.user_id

        model = ModelReader().get_latest_model(project_id=project_id)
        if model.model_id != command.model_id:
            raise ValueError(f'Model with id {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        event = ModelLayerConfinementUpdatedEvent.from_confinement(
            project_id=project_id,
            model_id=command.model_id,
            layer_id=command.layer_id,
            confinement=command.confinement,
            occurred_at=DateTime.now(),
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
