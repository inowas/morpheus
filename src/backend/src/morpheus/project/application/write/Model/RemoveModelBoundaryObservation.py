import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelBoundaryEvents import ModelBoundaryObservationRemovedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.boundaries.Boundary import BoundaryId
from morpheus.project.types.boundaries.Observation import ObservationId


class RemoveModelBoundaryObservationCommandPayload(TypedDict):
    project_id: str
    model_id: str
    boundary_id: str
    observation_id: str


@dataclasses.dataclass(frozen=True)
class RemoveModelBoundaryObservationCommand(ProjectCommandBase):
    model_id: ModelId
    boundary_id: BoundaryId
    observation_id: ObservationId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: RemoveModelBoundaryObservationCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            boundary_id=BoundaryId.from_str(payload['boundary_id']),
            observation_id=ObservationId.from_str(payload['observation_id'])
        )


class RemoveModelBoundaryObservationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: RemoveModelBoundaryObservationCommand):
        project_id = command.project_id
        user_id = command.user_id

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)
        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        boundary = latest_model.boundaries.get_boundary(command.boundary_id)
        if boundary is None:
            raise ValueError(f'Boundary {command.boundary_id.to_str()} does not exist in model {command.model_id.to_str()}')

        observation = boundary.get_observation(command.observation_id)
        if observation is None:
            raise ValueError(f'Observation {command.observation_id.to_str()} does not exist in boundary {command.boundary_id.to_str()}')

        if len(boundary.observations) == 1:
            raise ValueError(f'Cannot remove last observation from boundary {command.boundary_id.to_str()}')

        event = ModelBoundaryObservationRemovedEvent.from_props(
            project_id=project_id,
            model_id=command.model_id,
            boundary_id=command.boundary_id,
            observation_id=command.observation_id,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
