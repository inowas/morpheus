import dataclasses
import uuid

from .Metadata import Metadata
from .Boundaries import BoundaryCollection
from .Layers import LayerCollection
from .Permissions import Permissions
from .SpatialDiscretization import SpatialDiscretization
from .TimeDiscretization import TimeDiscretization
from .User import UserId


@dataclasses.dataclass
class ModelId:
    value: str

    @classmethod
    def new(cls):
        return cls(value=str(uuid.uuid4()))

    @classmethod
    def from_str(cls, value: str):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value=value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass(frozen=True)
class ModflowModel:
    id: ModelId
    permissions: Permissions
    metadata: Metadata
    spatial_discretization: SpatialDiscretization
    time_discretization: TimeDiscretization
    boundaries: BoundaryCollection
    layers: LayerCollection

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=ModelId.from_value(obj['id']),
            metadata=Metadata.from_dict(obj['metadata']),
            permissions=Permissions.from_dict(obj['permissions']),
            spatial_discretization=SpatialDiscretization.from_dict(obj['spatial_discretization']),
            time_discretization=TimeDiscretization.from_dict(obj['time_discretization']),
            boundaries=BoundaryCollection.from_list(obj['boundaries']),
            layers=LayerCollection.from_list(obj['layers'])
        )

    @classmethod
    def new(cls, user_id: UserId):
        return cls(
            id=ModelId.new(),
            metadata=Metadata.new(),
            permissions=Permissions.new(creator_id=user_id),
            spatial_discretization=SpatialDiscretization.new(),
            time_discretization=TimeDiscretization.new(),
            boundaries=BoundaryCollection.new(),
            layers=LayerCollection.new()
        )

    def to_dict(self):
        return {
            'id': self.id.to_value(),
            'metadata': self.metadata.to_dict(),
            'permissions': self.permissions.to_dict(),
            'spatial_discretization': self.spatial_discretization.to_dict(),
            'time_discretization': self.time_discretization.to_dict(),
            'boundaries': self.boundaries.to_list(),
            'layers': self.layers.to_list()
        }

    def with_updated_metadata(self, metadata: Metadata):
        return dataclasses.replace(self, metadata=metadata)

    def with_updated_spatial_discretization(self, spatial_discretization: SpatialDiscretization):
        return dataclasses.replace(self, spatial_discretization=spatial_discretization)

    def with_updated_time_discretization(self, time_discretization: TimeDiscretization):
        return dataclasses.replace(self, time_discretization=time_discretization)

    def with_updated_boundaries(self, boundaries: BoundaryCollection):
        return dataclasses.replace(self, boundaries=boundaries)

    def with_updated_layers(self, layers: LayerCollection):
        return dataclasses.replace(self, layers=layers)
