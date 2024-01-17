import dataclasses

from morpheus.common.types import Uuid
from morpheus.modflow.types.boundaries.Boundary import BoundaryCollection
from morpheus.modflow.types.discretization import SpatialDiscretization, TimeDiscretization
from morpheus.modflow.types.observations.Observation import ObservationCollection
from morpheus.modflow.types.soil_model.SoilModel import SoilModel
from morpheus.modflow.types.transport.Transport import Transport
from morpheus.modflow.types.variable_density.VariableDensityFlow import VariableDensityFlow


class ModelId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class Version:
    last_version: str
    current_version: str
    is_head: bool

    @classmethod
    def new(cls, version: str = 'v0.0.0') -> 'Version':
        return cls(
            last_version=version,
            current_version=version + '-0',
            is_head=True
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            last_version=obj['last_version'],
            current_version=obj['current_version'],
            is_head=obj['is_head'],
        )

    def to_dict(self):
        return {
            'last_version': self.last_version,
            'current_version': self.current_version,
            'is_head': self.is_head,
        }

    def with_added_change(self) -> 'Version':
        current_version = self.current_version.split('-')
        current_version[-1] = str(int(current_version[-1]) + 1)
        return dataclasses.replace(self, current_version='-'.join(current_version))

    def with_updated_version(self, version: str) -> 'Version':
        return dataclasses.replace(self, last_version=version, current_version=version + '-0')

    def with_removed_head(self) -> 'Version':
        return dataclasses.replace(self, is_head=False)

    def with_added_head(self) -> 'Version':
        return dataclasses.replace(self, is_head=True)


@dataclasses.dataclass(frozen=True)
class ModflowModel:
    model_id: ModelId
    version: Version
    spatial_discretization: SpatialDiscretization
    time_discretization: TimeDiscretization
    boundaries: BoundaryCollection
    observations: ObservationCollection
    soil_model: SoilModel
    transport: Transport
    variable_density: VariableDensityFlow

    @classmethod
    def from_dict(cls, obj):
        return cls(
            model_id=ModelId.from_value(obj['model_id']),
            version=Version.from_dict(obj['version']),
            spatial_discretization=SpatialDiscretization.from_dict(obj['spatial_discretization']),
            time_discretization=TimeDiscretization.from_dict(obj['time_discretization']),
            boundaries=BoundaryCollection.from_dict(obj['boundaries']),
            observations=ObservationCollection.from_dict(obj['observations'] if 'observations' in obj else []),
            soil_model=SoilModel.from_dict(obj['soil_model']),
            transport=Transport.from_dict(obj['transport'] if 'transport' in obj else None),
            variable_density=VariableDensityFlow.from_dict(
                obj['variable_density'] if 'variable_density' in obj else None),
        )

    @classmethod
    def new(cls, model_id: ModelId | None = None):
        return cls(
            model_id=model_id if model_id is not None else ModelId.new(),
            version=Version.new(),
            spatial_discretization=SpatialDiscretization.new(),
            time_discretization=TimeDiscretization.new(),
            boundaries=BoundaryCollection.new(),
            observations=ObservationCollection.new(),
            soil_model=SoilModel.new(),
            transport=Transport.new(),
            variable_density=VariableDensityFlow.new(),
        )

    def to_dict(self):
        return {
            'model_id': self.model_id.to_value(),
            'version': self.version.to_dict(),
            'spatial_discretization': self.spatial_discretization.to_dict(),
            'time_discretization': self.time_discretization.to_dict(),
            'boundaries': self.boundaries.to_dict(),
            'observations': self.observations.to_dict(),
            'soil_model': self.soil_model.to_dict(),
            'transport': self.transport.to_dict(),
            'variable_density': self.variable_density.to_dict(),
        }

    def get_hash(self):
        model_data = self.to_dict()
        model_data.pop('version')
        return hash(model_data)

    def with_updated_spatial_discretization(self, spatial_discretization: SpatialDiscretization):
        return dataclasses.replace(self, spatial_discretization=spatial_discretization)

    def with_updated_time_discretization(self, time_discretization: TimeDiscretization):
        return dataclasses.replace(self, time_discretization=time_discretization)

    def with_updated_boundaries(self, boundaries: BoundaryCollection):
        return dataclasses.replace(self, boundaries=boundaries)

    def with_updated_observations(self, observations: ObservationCollection):
        return dataclasses.replace(self, observations=observations)

    def with_updated_soilmodel(self, soil_model: SoilModel):
        return dataclasses.replace(self, soil_model=soil_model)

    def with_updated_transport(self, transport: Transport):
        return dataclasses.replace(self, transport=transport)

    def with_updated_variable_density(self, variable_density: VariableDensityFlow):
        return dataclasses.replace(self, variable_density=variable_density)
