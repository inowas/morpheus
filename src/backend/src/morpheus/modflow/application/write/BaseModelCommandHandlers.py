import dataclasses

from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope, OccurredAt
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ...domain.events.BaseModelEvents import BaseModelCreatedEvent
from ...infrastructure.event_sourcing.ModflowEventBus import modflow_event_bus
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

        grid = Grid.from_polygon_with_relative_coordinates(
            polygon=command.geometry,
            rotation=Rotation.from_float(command.grid_properties['rotation']),
            x_coordinates=command.grid_properties['x_coordinates'],
            y_coordinates=command.grid_properties['y_coordinates'],
        )
        cells = GridCells.from_polygon(polygon=command.geometry, grid=grid)
        spatial_discretization = SpatialDiscretization(
            geometry=command.geometry,
            affected_cells=cells,
            grid=grid,
            crs=Crs.from_str('EPSG:4326')
        )

        base_model = base_model.with_updated_spatial_discretization(spatial_discretization)
        event = BaseModelCreatedEvent.from_base_model(project_id=project_id, base_model=base_model)
        event_metadata = EventMetadata(obj={'created_by': command.created_by.to_str()})
        envelope = EventEnvelope(event=event, metadata=event_metadata, occurred_at=OccurredAt.now())
        modflow_event_bus.record(event_envelope=envelope)


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
