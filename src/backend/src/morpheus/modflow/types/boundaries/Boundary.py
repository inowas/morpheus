import dataclasses
from typing import Literal

from morpheus.common.types import Uuid, String
from morpheus.modflow.types.boundaries.ConstantHeadData import ConstantHeadObservation, ConstantHeadDataItem

from ..discretization.spatial import GridCells, Grid
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point, LineString
from ..soil_model import LayerId


class BoundaryId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class BoundaryType:
    type: Literal['constant_head', 'drain', 'general_head', 'recharge', 'river', 'well']

    def __eq__(self, other):
        return self.type == other.type

    @classmethod
    def from_str(cls, value: Literal['constant_head', 'drain', 'general_head', 'recharge', 'river', 'well']):
        return cls(type=value)

    @classmethod
    def from_value(cls, value: Literal['constant_head', 'drain', 'general_head', 'recharge', 'river', 'well']):
        return cls.from_str(value=value)

    @classmethod
    def constant_head(cls):
        return cls.from_str('constant_head')

    @classmethod
    def drain(cls):
        return cls.from_str('drain')

    @classmethod
    def general_head(cls):
        return cls.from_str('general_head')

    @classmethod
    def recharge(cls):
        return cls.from_str('recharge')

    @classmethod
    def river(cls):
        return cls.from_str('river')

    @classmethod
    def well(cls):
        return cls.from_str('well')

    def to_str(self):
        return self.type

    def to_value(self):
        return self.type


class BoundaryName(String):
    pass


@dataclasses.dataclass
class Boundary:
    id: BoundaryId
    type: BoundaryType
    name: BoundaryName
    enabled: bool

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

    def __init__(self, id: BoundaryId, type: BoundaryType, boundary_name: BoundaryName, enabled: bool = True):
        self.id = id
        self.type = type
        self.name = boundary_name
        self.enabled = enabled

    @classmethod
    def from_dict(cls, obj):
        raise NotImplementedError()

    def to_dict(self):
        raise NotImplementedError()


@dataclasses.dataclass
class BoundaryCollection:
    boundaries: list[Boundary]

    def __iter__(self):
        return iter(self.boundaries)

    @classmethod
    def new(cls):
        return cls(boundaries=[])

    def add_boundary(self, boundary: Boundary):
        self.boundaries.append(boundary)

    def update_boundary(self, update: Boundary):
        self.boundaries = [boundary if boundary.id != update.id else update for boundary in self.boundaries]

    def remove_boundary(self, boundary_id: BoundaryId):
        self.boundaries = [boundary for boundary in self.boundaries if boundary.id != boundary_id]

    @classmethod
    def from_dict(cls, collection: list[dict]):
        new_collection = []
        for item in collection:
            boundary_type = BoundaryType.from_value(item.get('type', None))
            if BoundaryType.constant_head() == boundary_type:
                new_collection.append(ConstantHead.from_dict(item))
            else:
                raise ValueError(f'Unknown boundary type: {boundary_type}')
        return cls(boundaries=new_collection)

    def to_dict(self):
        return [boundary.to_dict() for boundary in self.boundaries]

    def get_boundaries_of_type(self, boundary_type: BoundaryType):
        return [boundary for boundary in self.boundaries if boundary.type == boundary_type]


@dataclasses.dataclass
class ConstantHead(Boundary):
    id: BoundaryId
    type: BoundaryType.constant_head()
    name: BoundaryName
    geometry: LineString
    affected_cells: GridCells
    affected_layers: list[LayerId]
    observations: list[ConstantHeadObservation]
    enabled = True

    def __init__(self, id: BoundaryId, name: BoundaryName, geometry: LineString, affected_cells: GridCells,
                 affected_layers: list[LayerId], observations: list[ConstantHeadObservation], enabled: bool = True):
        btype = BoundaryType.constant_head()
        super().__init__(id, btype, name, enabled)
        self.id = id
        self.type = btype
        self.name = name
        self.geometry = geometry
        self.affected_cells = affected_cells
        self.affected_layers = affected_layers
        self.observations = observations

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: LineString, grid: Grid, affected_layers: list[LayerId],
                      observations: list[ConstantHeadObservation] | None = None):  # -> ConstantHead:

        affected_cells = GridCells.from_linestring(linestring=geometry, grid=grid)
        if observations is None or len(observations) == 0:
            observations = [
                ConstantHeadObservation.new(geometry=Point(coordinates=geometry.coordinates[0]), raw_data=[])
            ]

        return cls(
            id=BoundaryId.new(),
            name=name,
            geometry=geometry,
            affected_cells=affected_cells,
            affected_layers=affected_layers,
            observations=observations,
            enabled=True
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=BoundaryId.from_value(obj['id']),
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[ConstantHeadObservation.from_dict(p) for p in obj['observation_points']],
            enabled=obj['enabled']
        )

    def to_dict(self):
        return {
            'id': self.id.to_value(),
            'type': self.type.to_value(),
            'name': self.name.to_value(),
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict(),
            'affected_layers': [layer_id.to_value() for layer_id in self.affected_layers],
            'observation_points': [observation.to_dict() for observation in self.observations],
            'enabled': self.enabled
        }

    def number_of_observations(self):
        return len(self.observations)

    def get_observations(self):
        return self.observations

    def as_geojson(self):
        return self.geometry.as_geojson()

    def get_mean_data(self, start_date_time: StartDateTime,
                      end_date_time: EndDateTime) -> list[ConstantHeadDataItem]:
        return [observation.get_data_item(start_date_time, end_date_time) for observation in self.observations]
