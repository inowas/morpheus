import dataclasses

from ...infrastructure.geometry import utils
from ...infrastructure.persistence.BaseModelRepository import BaseModelRepository
from ...types.Project import ProjectId
from ...types.User import UserId
from ...types.ModflowModel import ModflowModel
from morpheus.modflow.types.discretization.spatial.SpatialDiscretization import Polygon, CRS, SpatialDiscretization, \
    CreateGridDict, LengthUnit, Rotation


@dataclasses.dataclass(frozen=True)
class CreateBaseModelCommand:
    project_id: ProjectId
    geometry: Polygon
    grid_properties: CreateGridDict
    user_id: UserId


@dataclasses.dataclass(frozen=True)
class CreateModflowModelCommandResult:
    pass


class CreateBaseModelCommandHandler:

    @staticmethod
    def handle(command: CreateBaseModelCommand):
        project_id = command.project_id
        base_model = ModflowModel.new()

        grid = utils.grid_from_polygon(
            polygon=command.geometry,
            rotation=Rotation.from_float(command.grid_properties['rotation']),
            length_unit=LengthUnit.from_str(command.grid_properties['length_unit']),
            x_coordinates=command.grid_properties['x_coordinates'],
            y_coordinates=command.grid_properties['y_coordinates'],
        )

        affected_cells = utils.calculate_cells_from_polygon(
            geometry=command.geometry,
            grid=grid
        )

        spatial_discretization = SpatialDiscretization(
            geometry=command.geometry,
            affected_cells=affected_cells,
            grid=grid,
            crs=CRS.from_str('EPSG:4326')
        )

        base_model = base_model.with_updated_spatial_discretization(spatial_discretization)

        repository = BaseModelRepository()
        repository.safe_base_model(project_id=project_id, base_model=base_model)

        return CreateModflowModelCommandResult()
