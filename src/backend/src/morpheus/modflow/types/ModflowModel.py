import dataclasses

from morpheus.common.types import String, Uuid
from morpheus.modflow.types.boundaries.Boundary import BoundaryCollection
from morpheus.modflow.types.discretization import SpatialDiscretization, TimeDiscretization
from morpheus.modflow.types.soil_model.SoilModel import SoilModel


class ModelId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class ModflowModel:
    model_id: ModelId
    spatial_discretization: SpatialDiscretization
    time_discretization: TimeDiscretization
    boundaries: BoundaryCollection
    soil_model: SoilModel

    @classmethod
    def from_dict(cls, obj):
        return cls(
            model_id=ModelId.from_value(obj['model_id']),
            spatial_discretization=SpatialDiscretization.from_dict(obj['spatial_discretization']),
            time_discretization=TimeDiscretization.from_dict(obj['time_discretization']),
            boundaries=BoundaryCollection.from_list(obj['boundaries']),
            soil_model=SoilModel.from_dict(obj['soilmodel'])
        )

    @classmethod
    def new(cls):
        return cls(
            model_id=ModelId.new(),
            spatial_discretization=SpatialDiscretization.new(),
            time_discretization=TimeDiscretization.new(),
            boundaries=BoundaryCollection.new(),
            soil_model=SoilModel.new(),
        )

    def to_dict(self):
        return {
            'model_id': self.model_id.to_value(),
            'spatial_discretization': self.spatial_discretization.to_dict(),
            'time_discretization': self.time_discretization.to_dict(),
            'boundaries': self.boundaries.to_list(),
            'soil_model': self.soil_model.to_dict(),
        }

    def with_updated_spatial_discretization(self, spatial_discretization: SpatialDiscretization):
        return dataclasses.replace(self, spatial_discretization=spatial_discretization)

    def with_updated_time_discretization(self, time_discretization: TimeDiscretization):
        return dataclasses.replace(self, time_discretization=time_discretization)

    def with_updated_boundaries(self, boundaries: BoundaryCollection):
        return dataclasses.replace(self, boundaries=boundaries)

    def with_updated_soilmodel(self, soil_model: SoilModel):
        return dataclasses.replace(self, soil_model=soil_model)
