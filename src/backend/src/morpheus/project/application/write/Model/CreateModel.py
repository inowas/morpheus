import dataclasses
from typing import TypedDict

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.PermissionsReader import PermissionsReader

from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.CalculationEvents.CalculationProfileAddedEvent import CalculationProfileAddedEvent
from morpheus.project.domain.events.ModelEvents.GeneralModelEvents import ModelCreatedEvent, VersionCreatedEvent, VersionAssignedToModelEvent
from morpheus.project.domain.events.ProjectEvents.ProjectEvents import ProjectCalculationProfileIdUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId, Model
from morpheus.project.types.ModelVersion import VersionDescription, VersionTag, ModelVersion
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile
from morpheus.project.types.discretization import SpatialDiscretization
from morpheus.project.types.discretization.spatial import Rotation, ActiveCells, Grid
from morpheus.project.types.geometry import Polygon


class CreateModelCommandPayload(TypedDict):
    project_id: str
    geometry: dict
    n_cols: int
    n_rows: int
    rotation: float


@dataclasses.dataclass(frozen=True)
class CreateModelCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    geometry: Polygon
    n_cols: int
    n_rows: int
    rotation: Rotation

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.new(),
            geometry=Polygon.from_dict(payload['geometry']),
            n_cols=payload['n_cols'],
            n_rows=payload['n_rows'],
            rotation=Rotation(payload['rotation']),
        )


class CreateModelCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: CreateModelCommand):
        project_id = command.project_id
        model = Model.new(command.model_id)
        user_id = command.user_id

        grid = Grid.cartesian_from_polygon(
            polygon=command.geometry,
            n_cols=command.n_cols,
            n_rows=command.n_rows,
            rotation=command.rotation,
        )

        cells = ActiveCells.from_polygon(polygon=command.geometry, grid=grid)
        spatial_discretization = SpatialDiscretization(
            geometry=command.geometry,
            affected_cells=cells,
            grid=grid,
        )

        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to create a model of {project_id.to_str()}')

        model = model.with_updated_spatial_discretization(spatial_discretization)

        event = ModelCreatedEvent.from_model(project_id=project_id, model=model, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        initial_version = ModelVersion.new(tag=VersionTag.from_str('v0.0.0'), description=VersionDescription.from_str('Initial version'))
        event = VersionCreatedEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        event = VersionAssignedToModelEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        default_calculation_profile = CalculationProfile.default()
        event = CalculationProfileAddedEvent.from_calculation_profile(project_id=project_id, calculation_profile=default_calculation_profile, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)

        event = ProjectCalculationProfileIdUpdatedEvent.from_calculation_profile_id(project_id=project_id, calculation_profile_id=default_calculation_profile.id, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(command.user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
