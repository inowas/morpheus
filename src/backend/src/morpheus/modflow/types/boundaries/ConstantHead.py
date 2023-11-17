import dataclasses
from .Boundary import BoundaryBase, BoundaryId, BoundaryType, ObservationId
from morpheus.modflow.types.discretization.SpatialDiscretization import Point, AffectedCells, LineString
from morpheus.modflow.types.discretization.TimeDiscretization import DateTime


@dataclasses.dataclass
class ConstantHeadObservation:
    id: ObservationId
    geometry: Point
    date_times: list[DateTime]
    heads: list[float]

    def __init__(self, id: ObservationId, geometry: Point, date_times: list[DateTime], heads: list[float]):
        self.id = id
        self.geometry = geometry
        self.date_times = date_times
        self.heads = heads

        if len(self.date_times) != len(self.heads):
            raise ValueError('Number of date times must match number of stages')

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=ObservationId.from_value(obj['id']),
            geometry=Point.from_dict(obj['geometry']),
            date_times=[DateTime.from_value(t) for t in obj['date_times']],
            heads=obj['heads']
        )

    def to_dict(self):
        return {
            'id': self.id.to_value(),
            'geometry': self.geometry.to_dict(),
            'date_times': [dt.to_value() for dt in self.date_times],
            'heads': self.heads
        }


@dataclasses.dataclass
class ConstantHead(BoundaryBase):
    id: BoundaryId
    type: BoundaryType.constant_head()
    geometry: LineString
    affected_cells: AffectedCells
    observations: list[ConstantHeadObservation]

    def __init__(self, id: BoundaryId, geometry: LineString, affected_cells: AffectedCells,
                 observations: list[ConstantHeadObservation]):
        self.id = id
        self.type = BoundaryType.constant_head()
        self.geometry = geometry
        self.affected_cells = affected_cells.convert_to_float_or_none()
        self.observations = observations

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=BoundaryId.from_value(obj['id']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=AffectedCells.from_dict(obj['affected_cells']),
            observations=[ConstantHeadObservation.from_dict(p) for p in obj['observation_points']],
        )

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict(),
            'observation_points': [p.to_dict() for p in self.observations]
        }
