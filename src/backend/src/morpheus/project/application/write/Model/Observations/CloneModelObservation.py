import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelObservationEvents import ModelObservationClonedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.observations.HeadObservation import ObservationId


class CloneModelObservationCommandPayload(TypedDict):
    project_id: str
    model_id: str
    observation_id: str


@dataclasses.dataclass(frozen=True)
class CloneModelObservationCommand(ProjectCommandBase):
    model_id: ModelId
    observation_id: ObservationId
    new_observation_id: ObservationId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: CloneModelObservationCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            observation_id=ObservationId.from_str(payload['observation_id']),
            new_observation_id=ObservationId.new()
        )


class CloneModelObservationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: CloneModelObservationCommand):
        project_id = command.project_id
        user_id = command.user_id

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)

        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        event = ModelObservationClonedEvent.from_observation_id(
            project_id=project_id,
            model_id=command.model_id,
            observation_id=command.observation_id,
            new_observation_id=command.new_observation_id,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
