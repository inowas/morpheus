import dataclasses
import uuid
from typing import Literal

from ...types.ModflowModel import ModflowModel, ModelId
from ...types.Metadata import Metadata, Description, Name, Tags, UserId
from ...types.SpatialDiscretization import Polygon, Grid, Rotation, CRS, SpatialDiscretization, LengthUnit, Area
from ...types.TimeDiscretization import TimeDiscretization
from ...types.Boundaries import BoundaryCollection
from ...types.Layers import LayerCollection

from ...infrastructure.persistence.ModflowModelRepository import ModflowModelRepository


@dataclasses.dataclass(frozen=True)
class ModelArea:
    type: Literal['polygon']
    coordinates: list[list[tuple[float, float]]]


@dataclasses.dataclass(frozen=True)
class CreateModflowModelCommand:
    name: Name
    description: Description
    tags: Tags
    geometry: Polygon
    grid: Grid
    length_unit: LengthUnit
    rotation: Rotation
    crs: CRS
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
        new_model = ModflowModel(
            id=ModelId(value=str(uuid.uuid4())),
            metadata=Metadata(
                name=command.name,
                description=command.description,
                tags=command.tags,
                user=command.user_id
            ),
            spatial_discretization=SpatialDiscretization(
                area=Area.from_geometry(command.geometry),
                grid=command.grid,
                length_unit=command.length_unit,
                rotation=command.rotation,
                crs=command.crs
            ),
            time_discretization=TimeDiscretization.from_default(),
            boundaries=BoundaryCollection.from_default(),
            layers=LayerCollection.from_default()
        )

        repository = ModflowModelRepository()
        repository.save_modflow_model(new_model)

        return CreateModflowModelCommandResult(id=new_model.id.to_str())
