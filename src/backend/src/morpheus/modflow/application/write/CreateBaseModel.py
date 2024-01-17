import dataclasses

from ...infrastructure.persistence.BaseModelRepository import base_model_repository
from ...types.Project import ProjectId
from ...types.User import UserId
from ...types.ModflowModel import ModflowModel, ModelId
from ...types.discretization.spatial import GridCells
from ...types.discretization.spatial.SpatialDiscretization import Polygon, SpatialDiscretization, Rotation
from ...types.discretization.spatial.Crs import Crs
from ...types.discretization.spatial.Grid import CreateGridDict, Grid


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
        base_model_repository.save_base_model(project_id=project_id, base_model=base_model)
