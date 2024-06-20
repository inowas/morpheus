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
from morpheus.project.domain.events.ModelEvents.ModelBoundaryEvents import ModelBoundaryGeometryUpdatedEvent, \
    ModelBoundaryAffectedCellsRecalculatedEvent, ModelBoundaryObservationGeometryRecalculatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.boundaries.Boundary import BoundaryId
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import Polygon, LineString, Point, GeometryFactory


class UpdateModelBoundaryGeometryCommandPayload(TypedDict):
    project_id: str
    model_id: str
    boundary_id: str
    geometry: dict


@dataclasses.dataclass(frozen=True)
class UpdateModelBoundaryGeometryCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    boundary_id: BoundaryId
    geometry: Point | LineString | Polygon

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelBoundaryGeometryCommandPayload):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            boundary_id=BoundaryId.from_str(payload['boundary_id']),
            geometry=GeometryFactory.from_dict(payload['geometry']),
        )


class UpdateModelBoundaryGeometryCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelBoundaryGeometryCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(
                f'User {user_id.to_str()} does not have permission to update the affected cells of {project_id.to_str()}')

        model_reader = ModelReader()
        latest_model = model_reader.get_latest_model(project_id=project_id)

        if latest_model.model_id != command.model_id:
            raise ValueError(f'Model {command.model_id.to_str()} does not exist in project {project_id.to_str()}')

        boundary = latest_model.boundaries.get_boundary(boundary_id=command.boundary_id)
        if not boundary:
            raise ValueError(
                f'Boundary {command.boundary_id.to_str()} does not exist in model {command.model_id.to_str()}')

        if boundary.geometry.type != command.geometry.type:
            raise ValueError(f'Geometry type mismatch: {boundary.geometry.type} != {command.geometry.type}')

        if boundary.geometry == command.geometry:
            return

        # Calculate the new affected cells
        current_grid = latest_model.spatial_discretization.grid
        new_affected_cells = ActiveCells.from_geometry(geometry=command.geometry, grid=current_grid)

        # Calculate the new observation geometries
        observation_geometries_to_update = {}
        observations = boundary.observations
        for observation in observations:
            if isinstance(command.geometry, Point):
                new_observation_geometry = command.geometry
                if new_observation_geometry != observation.geometry:
                    observation_geometries_to_update[observation.observation_id] = new_observation_geometry
            if isinstance(command.geometry, LineString):
                new_observation_geometry = command.geometry.nearest_point(observation.geometry)
                if new_observation_geometry != observation.geometry:
                    observation_geometries_to_update[observation.observation_id] = new_observation_geometry
            if isinstance(command.geometry, Polygon):
                new_observation_geometry = command.geometry.centroid()
                if new_observation_geometry != observation.geometry:
                    observation_geometries_to_update[observation.observation_id] = new_observation_geometry

        event = ModelBoundaryGeometryUpdatedEvent.from_props(
            project_id=project_id,
            model_id=command.model_id,
            boundary_id=command.boundary_id,
            geometry=command.geometry,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        if boundary.affected_cells != new_affected_cells:
            event = ModelBoundaryAffectedCellsRecalculatedEvent.from_props(
                project_id=project_id,
                model_id=command.model_id,
                boundary_id=command.boundary_id,
                affected_cells=new_affected_cells,
                occurred_at=DateTime.now()
            )
            event_envelope = EventEnvelope(event=event, metadata=event_metadata)
            project_event_bus.record(event_envelope=event_envelope)

        for observation_id, observation_geometry in observation_geometries_to_update.items():
            event = ModelBoundaryObservationGeometryRecalculatedEvent.from_props(
                project_id=project_id,
                model_id=command.model_id,
                boundary_id=command.boundary_id,
                observation_id=observation_id,
                observation_geometry=observation_geometry,
                occurred_at=DateTime.now()
            )

            event_envelope = EventEnvelope(event=event, metadata=event_metadata)
            project_event_bus.record(event_envelope=event_envelope)
