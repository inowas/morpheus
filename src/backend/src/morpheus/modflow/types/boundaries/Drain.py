import dataclasses
from .Boundary import BoundaryBase, BoundaryId, BoundaryType, ObservationId
from morpheus.modflow.types.descritization.SpatialDiscretization import Point, AffectedCells, LineString
from morpheus.modflow.types.descritization.TimeDiscretization import DateTime
from ..soilmodel.Layer import LayerId


@dataclasses.dataclass
class DrainObservation:
    id: ObservationId
    geometry: Point
    date_times: list[DateTime]
    stages: list[float]
    conductance: float
    bottom_elevation: float

    def __init__(self, id: ObservationId, geometry: Point, date_times: list[DateTime], stages: list[float],
                 conductance: float, bottom_elevation: float):
        self.id = id
        self.geometry = geometry
        self.date_times = date_times
        self.stages = stages
        self.conductance = conductance
        self.bottom_elevation = bottom_elevation

        if len(self.date_times) != len(self.stages):
            raise ValueError('Number of date times must match number of stages')

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=ObservationId.from_value(obj['id']),
            geometry=Point.from_dict(obj['geometry']),
            date_times=[DateTime.from_value(t) for t in obj['date_times']],
            stages=obj['stages'],
            conductance=obj['conductance'],
            bottom_elevation=obj['bottom_elevation']
        )

    def to_dict(self):
        return {
            'id': self.id.to_value(),
            'geometry': self.geometry.to_dict(),
            'date_times': [dt.to_value() for dt in self.date_times],
            'stages': self.stages,
            'conductance': self.conductance,
            'bottom_elevation': self.bottom_elevation
        }


@dataclasses.dataclass
class Drain(BoundaryBase):
    id: BoundaryId
    type: BoundaryType.drain()
    geometry: LineString
    layers: list[LayerId]
    affected_cells: AffectedCells
    observations: list[DrainObservation]

    def __init__(self, id: BoundaryId, geometry: LineString, layers: list[LayerId], affected_cells: AffectedCells,
                 observations: list[DrainObservation]):
        self.id = id
        self.type = BoundaryType.drain()
        self.geometry = geometry
        self.layers = layers
        self.affected_cells = affected_cells
        self.observations = observations

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=BoundaryId.from_value(obj['id']),
            geometry=LineString.from_dict(obj['geometry']),
            layers=[LayerId.from_value(layer) for layer in obj['layers']],
            affected_cells=AffectedCells.from_dict(obj['affected_cells']),
            observations=[DrainObservation.from_dict(p) for p in obj['observation_points']],
        )

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'geometry': self.geometry.to_dict(),
            'layers': [layer.to_value() for layer in self.layers],
            'affected_cells': self.affected_cells.to_dict(),
            'observation_points': [p.to_dict() for p in self.observations]
        }
