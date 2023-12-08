import dataclasses
from typing import Literal

from morpheus.common.types import Uuid, String
from .ConstantHeadObservation import ConstantHeadObservation
from .GeneralHeadObservation import GeneralHeadObservation
from .Observation import Observation, DataItem
from .RiverObservation import RiverObservation
from .WellObservation import WellObservation

from ..discretization.spatial import GridCells, Grid
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point, LineString, Polygon
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
    boundary_id: BoundaryId
    type: BoundaryType
    name: BoundaryName
    geometry: Point | LineString | Polygon
    affected_cells: GridCells
    affected_layers: list[LayerId]
    observations: list[Observation]
    enabled = True
    enabled: bool

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

    def __init__(self, boundary_id: BoundaryId, boundary_type: BoundaryType, name: BoundaryName,
                 geometry: LineString | Point | Polygon, affected_cells: GridCells, affected_layers: list[LayerId],
                 observations: list[Observation], enabled: bool = True):
        self.boundary_id = boundary_id
        self.type = boundary_type
        self.name = name
        self.geometry = geometry
        self.affected_cells = affected_cells
        self.affected_layers = affected_layers
        self.observations = observations
        self.enabled = enabled

    @classmethod
    def from_geometry_base(cls, boundary_type: BoundaryType, name: BoundaryName, geometry: Point | LineString | Polygon,
                           grid: Grid, affected_layers: list[LayerId], observations: list[Observation] | None = None):

        affected_cells = GridCells.empty_from_grid(grid=grid)

        if isinstance(geometry, Point):
            affected_cells = GridCells.from_point(point=geometry, grid=grid)

        if isinstance(geometry, LineString):
            affected_cells = GridCells.from_linestring(linestring=geometry, grid=grid)

        if isinstance(geometry, Polygon):
            affected_cells = GridCells.from_polygon(polygon=geometry, grid=grid)

        if observations is None or len(observations) == 0:
            observation_point_geometry = None

            if isinstance(geometry, Point):
                observation_point_geometry = geometry

            if isinstance(geometry, LineString):
                observation_point_geometry = Point(coordinates=geometry.coordinates[0])

            if isinstance(geometry, Polygon):
                observation_point_geometry = Point(coordinates=geometry.coordinates[0][0])

            if observation_point_geometry is None:
                raise ValueError('Could not determine observation point geometry')

            observations = [
                Observation.new(geometry=observation_point_geometry, raw_data=[])
            ]

        if boundary_type == BoundaryType.constant_head():
            return ConstantHeadBoundary(
                boundary_id=BoundaryId.new(),
                boundary_type=boundary_type,
                name=name,
                geometry=geometry,
                affected_cells=affected_cells,
                affected_layers=affected_layers,
                observations=observations,
                enabled=True
            )

        if boundary_type == BoundaryType.general_head():
            return GeneralHeadBoundary(
                boundary_id=BoundaryId.new(),
                boundary_type=boundary_type,
                name=name,
                geometry=geometry,
                affected_cells=affected_cells,
                affected_layers=affected_layers,
                observations=observations,
                enabled=True
            )

        if boundary_type == BoundaryType.river():
            return RiverBoundary(
                boundary_id=BoundaryId.new(),
                boundary_type=boundary_type,
                name=name,
                geometry=geometry,
                affected_cells=affected_cells,
                affected_layers=affected_layers,
                observations=observations,
                enabled=True
            )

        if boundary_type == BoundaryType.well():
            return WellBoundary(
                boundary_id=BoundaryId.new(),
                boundary_type=boundary_type,
                name=name,
                geometry=geometry,
                affected_cells=affected_cells,
                affected_layers=affected_layers,
                observations=observations,
                enabled=True
            )

    @classmethod
    def from_dict(cls, obj):
        boundary_type = BoundaryType.from_value(obj['type'])
        if BoundaryType.constant_head() == boundary_type:
            return ConstantHeadBoundary.from_dict(obj)
        elif BoundaryType.general_head() == boundary_type:
            return GeneralHeadBoundary.from_dict(obj)
        elif BoundaryType.river() == boundary_type:
            return RiverBoundary.from_dict(obj)
        elif BoundaryType.well() == boundary_type:
            return WellBoundary.from_dict(obj)
        else:
            raise ValueError(f'Unknown boundary type: {boundary_type}')

    def to_dict(self):
        return {
            'id': self.boundary_id.to_value(),
            'type': self.type.to_value(),
            'name': self.name.to_value(),
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict(),
            'affected_layers': [layer_id.to_value() for layer_id in self.affected_layers],
            'observations': [observation.to_dict() for observation in self.observations],
            'enabled': self.enabled
        }

    def number_of_observations(self):
        return len(self.observations)

    def get_observations(self):
        return self.observations

    def as_geojson(self):
        return self.geometry.as_geojson()

    def get_mean_data(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> list[DataItem]:
        return [observation.get_data_item(start_date_time, end_date_time) for observation in self.observations]


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
        self.boundaries = [boundary if boundary.boundary_id != update.boundary_id else update for boundary in
                           self.boundaries]

    def remove_boundary(self, boundary_id: BoundaryId):
        self.boundaries = [boundary for boundary in self.boundaries if boundary.boundary_id != boundary_id]

    @classmethod
    def from_dict(cls, collection: list[dict]):
        new_collection = []
        for item in collection:
            boundary_type = BoundaryType.from_value(item.get('type', None))
            if BoundaryType.constant_head() == boundary_type:
                new_collection.append(ConstantHeadBoundary.from_dict(item))
            else:
                raise ValueError(f'Unknown boundary type: {boundary_type}')
        return cls(boundaries=new_collection)

    def to_dict(self):
        return [boundary.to_dict() for boundary in self.boundaries]

    def get_boundaries_of_type(self, boundary_type: BoundaryType):
        return [boundary for boundary in self.boundaries if boundary.type == boundary_type]


class ConstantHeadBoundary(Boundary):
    type: BoundaryType.constant_head()
    geometry: LineString

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: LineString,
                      grid: Grid, affected_layers: list[LayerId], observations: list[Observation] | None = None):
        return cls.from_geometry_base(boundary_type=BoundaryType.constant_head(), name=name, geometry=geometry,
                                      grid=grid, affected_layers=affected_layers, observations=observations)

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=BoundaryType.from_value(obj['type']),
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[ConstantHeadObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class GeneralHeadBoundary(Boundary):
    type: BoundaryType.general_head()
    geometry = LineString

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: LineString,
                      grid: Grid, affected_layers: list[LayerId], observations: list[Observation] | None = None):
        return cls.from_geometry_base(boundary_type=BoundaryType.general_head(), name=name, geometry=geometry,
                                      grid=grid, affected_layers=affected_layers, observations=observations)

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=BoundaryType.from_value(obj['type']),
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[GeneralHeadObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class RiverBoundary(Boundary):
    type: BoundaryType.river()
    geometry = LineString

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=BoundaryType.from_value(obj['type']),
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[RiverObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class WellBoundary(Boundary):
    type: BoundaryType.well()
    geometry = Point

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=BoundaryType.from_value(obj['type']),
            name=BoundaryName.from_value(obj['name']),
            geometry=Point.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[WellObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )
