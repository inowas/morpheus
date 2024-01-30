import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ..read.PermissionsReader import PermissionsReader
from ...domain.events.BaseModelEvents import BaseModelCreatedEvent, VersionAssignedToBaseModelEvent, VersionCreatedEvent
from ...infrastructure.event_sourcing.ModflowEventBus import modflow_event_bus
from ...types.BaseModelVersion import BaseModelVersion, VersionId, VersionTag, VersionDescription
from ...types.Project import ProjectId
from ...types.User import UserId
from ...types.ModflowModel import ModflowModel, ModelId
from ...types.discretization.spatial import GridCells
from ...types.discretization.spatial.SpatialDiscretization import Polygon, SpatialDiscretization, Rotation
from ...types.discretization.spatial.Crs import Crs
from ...types.discretization.spatial.Grid import CreateGridDict, Grid
from ...types.discretization.time.Stressperiods import StartDateTime, EndDateTime, StressPeriodCollection
from ...types.discretization.time.TimeUnit import TimeUnit


@dataclasses.dataclass(frozen=True)
class CreateBaseModelCommand:
    model_id: ModelId
    project_id: ProjectId
    geometry: Polygon
    grid_properties: CreateGridDict
    created_by: UserId


class CreateBaseModelCommandHandler:

    @staticmethod
    def handle(command: CreateBaseModelCommand):
        project_id = command.project_id
        base_model = ModflowModel.new(command.model_id)
        current_user_id = command.created_by

        grid = Grid.cartesian_from_polygon(
            polygon=command.geometry,
            rotation=Rotation.from_float(command.grid_properties['rotation']),
            nx=command.grid_properties['nx'],
            ny=command.grid_properties['ny'],
        )
        cells = GridCells.from_polygon(polygon=command.geometry, grid=grid)
        spatial_discretization = SpatialDiscretization(
            geometry=command.geometry,
            affected_cells=cells,
            grid=grid,
            crs=Crs.from_str('EPSG:4326')
        )

        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to create a base model of {project_id.to_str()}')

        base_model = base_model.with_updated_spatial_discretization(spatial_discretization)
        create_event = BaseModelCreatedEvent.from_base_model(project_id=project_id, base_model=base_model, occurred_at=DateTime.now())
        create_event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        create_event_envelope = EventEnvelope(event=create_event, metadata=create_event_metadata)
        modflow_event_bus.record(event_envelope=create_event_envelope)

        initial_version = BaseModelVersion(
            version_id=VersionId.new(),
            tag=VersionTag.from_str('v0.0.0'),
            description=VersionDescription.from_str('Initial version'),
        )

        create_version_event = VersionCreatedEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        create_version_event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        create_version_event_envelope = EventEnvelope(event=create_version_event, metadata=create_version_event_metadata)
        modflow_event_bus.record(event_envelope=create_version_event_envelope)

        tag_version_event = VersionAssignedToBaseModelEvent.from_version(project_id=project_id, version=initial_version, occurred_at=DateTime.now())
        tag_version_event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        tag_version_event_envelope = EventEnvelope(event=tag_version_event, metadata=tag_version_event_metadata)
        modflow_event_bus.record(event_envelope=tag_version_event_envelope)


@dataclasses.dataclass(frozen=True)
class UpdateTimeDiscretizationCommand:
    project_id: ProjectId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    stress_periods: StressPeriodCollection
    time_unit: TimeUnit


class UpdateTimeDiscretizationCommandHandler:
    @staticmethod
    def handle(command: UpdateTimeDiscretizationCommand):
        raise Exception('Not implemented yet')
        # project_id = command.project_id
        # time_discretization = base_model_projection.get_base_model_time_discretization(project_id)
        # if time_discretization is None:
        #     raise Exception(f'Could not find basemodel time discretization for project with id {project_id.to_str()}')
        #
        # start_date_time = time_discretization.start_date_time
        # end_date_time = time_discretization.end_date_time
        # stress_periods = time_discretization.stress_periods
        # time_unit = time_discretization.time_unit
        #
        # time_discretization = TimeDiscretization(
        #     start_date_time=start_date_time,
        #     end_date_time=end_date_time,
        #     stress_periods=stress_periods,
        #     time_unit=time_unit
        # )
        #
        # project_repository = ProjectRepository()
        # base_model = project_repository.get_base_model(project_id)
        # if base_model is None:
        #     raise Exception(f'Could not find base model for project with id {project_id.to_str()}')
        #
        # base_model = base_model.with_updated_time_discretization(time_discretization)
        # project_repository.update_base_model(project_id=project_id, base_model=base_model)
