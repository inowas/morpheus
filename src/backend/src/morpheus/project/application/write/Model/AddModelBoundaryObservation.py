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
from morpheus.project.domain.events.ModelEvents.ModelBoundaryEvents import ModelBoundaryObservationAddedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.types.boundaries.Boundary import BoundaryId
from morpheus.project.types.boundaries.Observation import ObservationName, ObservationId
from morpheus.project.types.boundaries.ObservationFactory import ObservationFactory
from morpheus.project.types.geometry import Point


class AddModelBoundaryObservationCommandPayload(TypedDict):
    project_id: str
    model_id: str
    boundary_id: str
    observation_name: str
    observation_geometry: dict
    observation_data: list


@dataclasses.dataclass(frozen=True)
class AddModelBoundaryObservationCommand(CommandBase):
    user_id: UserId
    project_id: ProjectId
    model_id: ModelId
    boundary_id: BoundaryId
    observation_id: ObservationId
    observation_name: ObservationName
    observation_geometry: Point
    observation_data: list

    @classmethod
    def from_payload(cls, user_id: UserId, payload: AddModelBoundaryObservationCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            boundary_id=BoundaryId.from_str(payload['boundary_id']),
            observation_id=ObservationId.new(),
            observation_name=ObservationName.from_str(payload['observation_name']),
            observation_geometry=Point.from_dict(payload['observation_geometry']),
            observation_data=payload['observation_data'],
        )


class AddModelBoundaryObservationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: AddModelBoundaryObservationCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to execute {command.command_name()} for {project_id.to_str()}')

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)
        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        if not latest_model.boundaries.has_boundary(command.boundary_id):
            raise ValueError(f'Boundary {command.boundary_id.to_str()} does not exist in model {command.model_id.to_str()}')

        boundary = latest_model.boundaries.get_boundary(command.boundary_id)
        if boundary is None:
            raise ValueError(f'Boundary {command.boundary_id.to_str()} does not exist in model {command.model_id.to_str()}')

        boundary_type = boundary.type

        observation = ObservationFactory().new(boundary_type=boundary_type, observation_name=command.observation_name, observation_geometry=command.observation_geometry,
                                               observation_data=command.observation_data, observation_id=command.observation_id)

        event = ModelBoundaryObservationAddedEvent.from_props(
            project_id=project_id,
            model_id=command.model_id,
            boundary_id=command.boundary_id,
            boundary_type=boundary_type,
            observation=observation,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
