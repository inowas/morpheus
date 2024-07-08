import dataclasses
import hashlib
import json

from morpheus.common.types import Uuid, String
from morpheus.project.types.boundaries.Boundary import BoundaryCollection
from morpheus.project.types.discretization import SpatialDiscretization, TimeDiscretization
from morpheus.project.types.observations.HeadObservation import ObservationCollection
from morpheus.project.types.layers.LayersCollection import LayersCollection
from morpheus.project.types.transport.Transport import Transport
from morpheus.project.types.variable_density.VariableDensityFlow import VariableDensityFlow


class ModelId(Uuid):
    pass


class Sha1Hash(String):
    pass


@dataclasses.dataclass(frozen=True)
class Model:
    model_id: ModelId
    spatial_discretization: SpatialDiscretization
    time_discretization: TimeDiscretization
    boundaries: BoundaryCollection
    observations: ObservationCollection
    layers: LayersCollection
    transport: Transport
    variable_density: VariableDensityFlow

    @classmethod
    def from_dict(cls, obj):
        return cls(
            model_id=ModelId.from_value(obj['model_id']),
            spatial_discretization=SpatialDiscretization.from_dict(obj['spatial_discretization']),
            time_discretization=TimeDiscretization.from_dict(obj['time_discretization']),
            boundaries=BoundaryCollection.from_dict(obj['boundaries']),
            observations=ObservationCollection.from_dict(obj['observations']) if 'observations' in obj else ObservationCollection.new(),
            layers=LayersCollection.from_dict(obj['layers']),
            transport=Transport.from_dict(obj['transport'] if 'transport' in obj else None),
            variable_density=VariableDensityFlow.from_dict(obj['variable_density'] if 'variable_density' in obj else None))

    @classmethod
    def new(cls, model_id: ModelId | None = None):
        return cls(
            model_id=model_id if model_id is not None else ModelId.new(),
            spatial_discretization=SpatialDiscretization.new(),
            time_discretization=TimeDiscretization.new(),
            boundaries=BoundaryCollection.new(),
            observations=ObservationCollection.new(),
            layers=LayersCollection.new(),
            transport=Transport.new(),
            variable_density=VariableDensityFlow.new(),
        )

    def to_dict(self):
        return {
            'model_id': self.model_id.to_value(),
            'spatial_discretization': self.spatial_discretization.to_dict(),
            'time_discretization': self.time_discretization.to_dict(),
            'boundaries': self.boundaries.to_dict(),
            'observations': self.observations.to_dict(),
            'layers': self.layers.to_dict(),
            'transport': self.transport.to_dict(),
            'variable_density': self.variable_density.to_dict(),
        }

    def get_sha1_hash(self) -> Sha1Hash:
        dictionary = self.to_dict()
        dictionary.pop('model_id')
        encoded = json.dumps(dictionary, sort_keys=True, ensure_ascii=True).encode()
        return Sha1Hash.from_str(hashlib.sha1(encoded).hexdigest())

    def with_updated_spatial_discretization(self, spatial_discretization: SpatialDiscretization):
        return dataclasses.replace(self, spatial_discretization=spatial_discretization)

    def with_updated_time_discretization(self, time_discretization: TimeDiscretization):
        return dataclasses.replace(self, time_discretization=time_discretization)

    def with_updated_boundaries(self, boundaries: BoundaryCollection):
        return dataclasses.replace(self, boundaries=boundaries)

    def with_updated_observations(self, observations: ObservationCollection):
        return dataclasses.replace(self, observations=observations)

    def with_updated_layers(self, layers: LayersCollection):
        return dataclasses.replace(self, layers=layers)

    def with_updated_transport(self, transport: Transport):
        return dataclasses.replace(self, transport=transport)

    def with_updated_variable_density(self, variable_density: VariableDensityFlow):
        return dataclasses.replace(self, variable_density=variable_density)
