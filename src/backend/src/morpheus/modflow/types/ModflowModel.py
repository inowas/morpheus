import dataclasses

from .Metadata import Metadata
from .Boundaries import BoundaryCollection
from .Layers import LayerCollection
from .SpatialDiscretization import SpatialDiscretization
from .TimeDiscretization import TimeDiscretization


@dataclasses.dataclass
class ModelId:
    value: str

    @classmethod
    def from_str(cls, value: str):
        return cls(value=value)

    def to_str(self):
        return self.value


@dataclasses.dataclass
class ModflowModel:
    id: ModelId
    metadata: Metadata
    spatial_discretization: SpatialDiscretization
    time_discretization: TimeDiscretization
    boundaries: BoundaryCollection
    layers: LayerCollection

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=ModelId.from_str(obj['id']),
            metadata=Metadata.from_dict(obj['metadata']),
            spatial_discretization=SpatialDiscretization.from_dict(obj['spatial_discretization']),
            time_discretization=TimeDiscretization.from_dict(obj['time_discretization']),
            boundaries=BoundaryCollection.from_list(obj['boundaries']),
            layers=LayerCollection(
                layers=obj['layers']
            )
        )

    def to_dict(self):
        return {
            'id': self.id.to_str(),
            'metadata': self.metadata.to_dict(),
            'spatial_discretization': self.spatial_discretization.to_dict(),
            'time_discretization': self.time_discretization.to_dict(),
            'boundaries': self.boundaries.to_list(),
            'layers': self.layers.to_list()
        }
