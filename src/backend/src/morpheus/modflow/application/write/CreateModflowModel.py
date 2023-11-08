import dataclasses

from ...infrastructure.geometry import utils
from ...infrastructure.persistence.ModflowModelRepository import ModflowModelRepository
from ...types.User import UserId
from ...types.Metadata import Metadata, Description, Name, Tags
from ...types.ModflowModel import ModflowModel
from ...types.SpatialDiscretization import Polygon, CRS, SpatialDiscretization, CreateGridDict, LengthUnit, Rotation


@dataclasses.dataclass(frozen=True)
class CreateModflowModelCommand:
    name: Name
    description: Description
    tags: Tags
    geometry: Polygon
    grid_properties: CreateGridDict
    user_id: UserId


@dataclasses.dataclass
class CreateModflowModelCommandResult:
    id: str

    def to_dict(self):
        return {
            'id': self.id
        }


class CreateModflowModelCommandHandler:

    @staticmethod
    def handle(command: CreateModflowModelCommand):
        modflow_model = ModflowModel.new(command.user_id)

        metadata = Metadata(name=command.name, description=command.description, tags=command.tags, )
        modflow_model = modflow_model.with_updated_metadata(metadata)

        grid = utils.grid_from_polygon(
            polygon=command.geometry,
            rotation=Rotation.from_float(command.grid_properties['rotation']),
            length_unit=LengthUnit.from_str(command.grid_properties['length_unit']),
            x_coordinates=command.grid_properties['x_coordinates'],
            y_coordinates=command.grid_properties['y_coordinates'],
        )

        affected_cells = utils.calculate_affected_cells(
            geometry=command.geometry,
            grid=grid
        )

        spatial_discretization = SpatialDiscretization(
            geometry=command.geometry,
            affected_cells=affected_cells,
            grid=grid,
            crs=CRS.from_str('EPSG:4326')
        )

        modflow_model = modflow_model.with_updated_spatial_discretization(spatial_discretization)

        repository = ModflowModelRepository()
        repository.save_modflow_model(modflow_model)

        return CreateModflowModelCommandResult(id=modflow_model.model_id.to_str())
