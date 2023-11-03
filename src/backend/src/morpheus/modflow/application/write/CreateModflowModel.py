import dataclasses
import uuid

from ...types.ModflowModel import ModflowModel, ModelId
from ...types.Metadata import Metadata, Description, Name, Tags, UserId
from ...types.SpatialDiscretization import Polygon, Grid, CRS, SpatialDiscretization, CreateGridDict, LengthUnit, \
    Rotation
from ...types.TimeDiscretization import TimeDiscretization
from ...types.Boundaries import BoundaryCollection
from ...types.Layers import LayerCollection

from ...infrastructure.persistence.ModflowModelRepository import ModflowModelRepository


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
        model_id = ModelId(value=str(uuid.uuid4()))
        metadata = Metadata(
            name=command.name,
            description=command.description,
            tags=command.tags,
            user=command.user_id
        )

        grid = Grid.from_polygon(
            area=command.geometry,
            rotation=Rotation.from_float(command.grid_properties['rotation']),
            length_unit=LengthUnit.from_str(command.grid_properties['length_unit']),
            x_coordinates=command.grid_properties['x_coordinates'],
            y_coordinates=command.grid_properties['y_coordinates'],
        )
        spatial_discretization = SpatialDiscretization(
            geometry=command.geometry,
            affected_cells=None,
            grid=grid,
            crs=CRS.from_str('EPSG:4326')
        )
        spatial_discretization = spatial_discretization.calculate_affected_cells()

        time_discretization = TimeDiscretization.from_default()
        boundaries = BoundaryCollection.from_default()
        layers = LayerCollection.from_default()

        new_model = ModflowModel(
            id=model_id,
            metadata=metadata,
            spatial_discretization=spatial_discretization,
            time_discretization=time_discretization,
            boundaries=boundaries,
            layers=layers
        )

        repository = ModflowModelRepository()
        repository.save_modflow_model(new_model)

        return CreateModflowModelCommandResult(id=new_model.id.to_str())
