import dataclasses

from .Boundary import BoundaryBase, BoundaryId, BoundaryType
from morpheus.modflow.types.descritization.SpatialDiscretization import Point, AffectedCells
from morpheus.modflow.types.descritization.TimeDiscretization import DateTime
from ..soilmodel.Layer import LayerId


@dataclasses.dataclass
class Well(BoundaryBase):
    id: BoundaryId
    type: BoundaryType.well()
    geometry: Point
    layers: list[LayerId]
    affected_cells: AffectedCells
    date_times: list[DateTime]
    pumping_rates: list[float]

    def __init__(self, id: BoundaryId, geometry: Point, layers: list[LayerId], affected_cells: AffectedCells,
                 date_times: list[DateTime], pumping_rates: list[float]):
        self.id = id
        self.type = BoundaryType.well()
        self.geometry = geometry
        self.layers = layers
        self.affected_cells = affected_cells
        self.date_times = date_times
        self.pumping_rates = pumping_rates

        if len(self.date_times) != len(self.pumping_rates):
            raise ValueError('Number of date times must match number of pumping rates')

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=obj['id'],
            geometry=Point.from_dict(obj['geometry']),
            layers=[LayerId.from_value(layer) for layer in obj['layers']],
            affected_cells=AffectedCells.from_dict(obj['affected_cells']),
            date_times=[DateTime.from_value(t) for t in obj['date_times']],
            pumping_rates=obj['pumping_rates']
        )

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'geometry': self.geometry.to_dict(),
            'layers': [layer.to_value() for layer in self.layers],
            'affected_cells': self.affected_cells.to_dict(),
            'date_times': [dt.to_value() for dt in self.date_times],
            'pumping_rates': self.pumping_rates
        }
