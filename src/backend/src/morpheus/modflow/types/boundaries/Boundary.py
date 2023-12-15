import dataclasses
from typing import Literal

from morpheus.common.types import Uuid, String
from .ConstantHeadObservation import ConstantHeadObservation
from .DrainObservation import DrainObservation
from .EvapotranspirationObservation import EvapotranspirationObservation
from .GeneralHeadObservation import GeneralHeadObservation
from .Observation import Observation, DataItem
from .RechargeObservation import RechargeObservation, RechargeRawDataItem
from .RiverObservation import RiverObservation
from .WellObservation import WellObservation, WellRawDataItem

from ..discretization.spatial import GridCells, Grid
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point, LineString, Polygon, GeometryCollection
from ..soil_model import LayerId


class BoundaryId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class BoundaryType:
    type: Literal['constant_head', 'evapotranspiration', 'drain', 'general_head', 'recharge', 'river', 'well']

    def __eq__(self, other):
        return self.type == other.type

    @classmethod
    def from_str(cls, value: Literal[
        'constant_head', 'evapotranspiration', 'drain', 'general_head', 'recharge', 'river', 'well'
    ]):
        return cls(type=value)

    @classmethod
    def from_value(cls, value: Literal[
        'constant_head', 'evapotranspiration', 'drain', 'general_head', 'recharge', 'river', 'well'
    ]):
        return cls.from_str(value=value)

    @classmethod
    def constant_head(cls):
        return cls.from_str('constant_head')

    @classmethod
    def evapotranspiration(cls):
        return cls.from_str('evapotranspiration')

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
    enabled: bool = True

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
    def from_dict(cls, obj):
        boundary_type = BoundaryType.from_value(obj.get('type', None))
        if BoundaryType.constant_head() == boundary_type:
            return ConstantHeadBoundary.from_dict(obj)
        if BoundaryType.drain() == boundary_type:
            return DrainBoundary.from_dict(obj)
        if BoundaryType.evapotranspiration() == boundary_type:
            return EvapotranspirationBoundary.from_dict(obj)
        if BoundaryType.general_head() == boundary_type:
            return GeneralHeadBoundary.from_dict(obj)
        if BoundaryType.recharge() == boundary_type:
            return RechargeBoundary.from_dict(obj)
        if BoundaryType.river() == boundary_type:
            return RiverBoundary.from_dict(obj)
        if BoundaryType.well() == boundary_type:
            return WellBoundary.from_dict(obj)
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

    def __len__(self):
        return len(self.boundaries)

    @classmethod
    def new(cls):
        return cls(boundaries=[])

    def as_geojson(self):
        return GeometryCollection(geometries=[boundary.geometry for boundary in self.boundaries]).as_geojson()

    def add_boundary(self, boundary: Boundary):
        self.boundaries.append(boundary)

    def update_boundary(self, update: Boundary):
        self.boundaries = [boundary if boundary.boundary_id != update.boundary_id else update for boundary in
                           self.boundaries]

    def remove_boundary(self, boundary_id: BoundaryId):
        self.boundaries = [boundary for boundary in self.boundaries if boundary.boundary_id != boundary_id]

    @classmethod
    def from_dict(cls, collection: list[dict]):
        boundary_list = [Boundary.from_dict(item) for item in collection]
        return cls(boundaries=boundary_list)

    def to_dict(self):
        return [boundary.to_dict() for boundary in self.boundaries]

    def get_boundaries_of_type(self, boundary_type: BoundaryType):
        return [boundary for boundary in self.boundaries if boundary.type == boundary_type]


class ConstantHeadBoundary(Boundary):
    type: BoundaryType = BoundaryType.constant_head()
    geometry: LineString

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: LineString, grid: Grid, affected_layers: list[LayerId],
                      observations: list[Observation] | None = None):
        if not isinstance(geometry, LineString):
            raise ValueError('Constant head boundaries must be lines')

        if observations is None:
            observations = [
                ConstantHeadObservation.new(geometry=Point(coordinates=geometry.coordinates[0]), raw_data=[]),
            ]

        return cls(
            boundary_id=BoundaryId.new(),
            boundary_type=cls.type,
            name=name,
            geometry=geometry,
            affected_cells=GridCells.from_linestring(linestring=geometry, grid=grid),
            affected_layers=affected_layers,
            observations=observations,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=cls.type,
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[ConstantHeadObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class DrainBoundary(Boundary):
    type: BoundaryType = BoundaryType.drain()
    geometry: LineString

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: LineString, grid: Grid, affected_layers: list[LayerId],
                      observations: list[Observation] | None = None):
        if not isinstance(geometry, LineString):
            raise ValueError('Drain boundaries must be lines')

        if observations is None:
            observations = [
                DrainObservation.new(geometry=Point(coordinates=geometry.coordinates[0]), raw_data=[]),
            ]

        return cls(
            boundary_id=BoundaryId.new(),
            boundary_type=cls.type,
            name=name,
            geometry=geometry,
            affected_cells=GridCells.from_linestring(linestring=geometry, grid=grid),
            affected_layers=affected_layers,
            observations=observations,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=cls.type,
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[DrainObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class EvapotranspirationBoundary(Boundary):
    type: BoundaryType = BoundaryType.evapotranspiration()
    geometry: Polygon

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: Polygon, grid: Grid, affected_layers: list[LayerId],
                      observations: list[Observation] | None = None):

        if len(observations) > 1:
            raise ValueError('Evapotranspiration boundaries can only have one observation point')
        if not isinstance(geometry, Polygon):
            raise ValueError('Evapotranspiration boundaries must be polygons')

        if observations is None:
            centroid = geometry.centroid()
            observations = [
                EvapotranspirationObservation.new(geometry=centroid, raw_data=[]),
            ]

        return cls(
            boundary_id=BoundaryId.new(),
            boundary_type=cls.type,
            name=name,
            geometry=geometry,
            affected_cells=GridCells.from_polygon(polygon=geometry, grid=grid),
            affected_layers=affected_layers,
            observations=observations,
            enabled=True
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=cls.type,
            name=BoundaryName.from_value(obj['name']),
            geometry=Polygon.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[EvapotranspirationObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class GeneralHeadBoundary(Boundary):
    type: BoundaryType = BoundaryType.general_head()
    geometry: LineString

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: LineString, grid: Grid, affected_layers: list[LayerId],
                      observations: list[Observation] | None = None):
        if not isinstance(geometry, LineString):
            raise ValueError('General head boundaries must be lines')

        if observations is None:
            observations = [
                GeneralHeadObservation.new(geometry=Point(coordinates=geometry.coordinates[0]), raw_data=[]),
            ]

        return cls(
            boundary_id=BoundaryId.new(),
            boundary_type=cls.type,
            name=name,
            geometry=geometry,
            affected_cells=GridCells.from_linestring(linestring=geometry, grid=grid),
            affected_layers=affected_layers,
            observations=observations,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=cls.type,
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[GeneralHeadObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class RechargeBoundary(Boundary):
    type: BoundaryType = BoundaryType.recharge()
    geometry: Polygon

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: Polygon, grid: Grid, affected_layers: list[LayerId],
                      raw_data: list[RechargeRawDataItem] | None = None):
        return cls(
            boundary_id=BoundaryId.new(),
            boundary_type=cls.type,
            name=name,
            geometry=geometry,
            affected_cells=GridCells.from_polygon(polygon=geometry, grid=grid),
            affected_layers=affected_layers,
            observations=[
                RechargeObservation.new(geometry=geometry.centroid(), raw_data=raw_data or [])
            ],
            enabled=True
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=BoundaryType.recharge(),
            name=BoundaryName.from_value(obj['name']),
            geometry=Polygon.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[RechargeObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class RiverBoundary(Boundary):
    type: BoundaryType = BoundaryType.river()
    geometry: LineString

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: LineString, grid: Grid, affected_layers: list[LayerId],
                      observations: list[Observation] | None = None):
        if not isinstance(geometry, LineString):
            raise ValueError('River boundaries must be lines')

        if observations is None:
            observations = [
                RiverObservation.new(geometry=Point(coordinates=geometry.coordinates[0]), raw_data=[]),
            ]

        return cls(
            boundary_id=BoundaryId.new(),
            boundary_type=cls.type,
            name=name,
            geometry=geometry,
            affected_cells=GridCells.from_linestring(linestring=geometry, grid=grid),
            affected_layers=affected_layers,
            observations=observations,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=cls.type,
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[RiverObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )


class WellBoundary(Boundary):
    type: BoundaryType = BoundaryType.well()
    geometry: Point

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: Point, grid: Grid, affected_layers: list[LayerId],
                      raw_data: list[WellRawDataItem] | None = None):
        if not isinstance(geometry, Point):
            raise ValueError('Well boundaries must be points')

        observations = [
            WellObservation.new(geometry=geometry, raw_data=raw_data)
        ]

        return cls(
            boundary_id=BoundaryId.new(),
            boundary_type=cls.type,
            name=name,
            geometry=geometry,
            affected_cells=GridCells.from_point(point=geometry, grid=grid),
            affected_layers=affected_layers,
            observations=observations,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            boundary_id=BoundaryId.from_value(obj['id']),
            boundary_type=cls.type,
            name=BoundaryName.from_value(obj['name']),
            geometry=Point.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[WellObservation.from_dict(observation) for observation in obj['observations']],
            enabled=obj['enabled']
        )
