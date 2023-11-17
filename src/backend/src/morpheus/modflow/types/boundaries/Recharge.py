import dataclasses

from .Boundary import BoundaryBase, BoundaryId, BoundaryType
from morpheus.modflow.types.descritization.SpatialDiscretization import Point, AffectedCells, Polygon
from morpheus.modflow.types.descritization.TimeDiscretization import DateTime
from ..soilmodel.Layer import LayerId


@dataclasses.dataclass
class Recharge(BoundaryBase):
    id: BoundaryId
    type: BoundaryType.recharge()
    geometry: Polygon
    layers: list[LayerId]
    affected_cells: AffectedCells
    date_times: list[DateTime]
    recharge_rates: list[float]

    def __init__(self, id: BoundaryId, geometry: Polygon, layers: list[LayerId], affected_cells: AffectedCells,
                 date_times: list[DateTime], recharge_rates: list[float]):
        self.id = id
        self.type = BoundaryType.recharge()
        self.geometry = geometry
        self.layers = layers
        self.affected_cells = affected_cells
        self.date_times = date_times
        self.recharge_rates = recharge_rates

        if len(self.date_times) != len(self.recharge_rates):
            raise ValueError('Number of date times must match number of recharge rates')

    @classmethod
    def from_dict(cls, obj):
        date_times = [DateTime.from_value(t) for t in obj['date_times']]
        recharge_rates = obj['recharge_rates']
        if len(date_times) != len(recharge_rates):
            raise ValueError('Number of date times must match number of recharge rates')

        return cls(
            id=obj['id'],
            geometry=Point.from_dict(obj['geometry']),
            layers=[LayerId.from_value(layer) for layer in obj['layers']],
            affected_cells=AffectedCells.from_dict(obj['affected_cells']),
            date_times=date_times,
            recharge_rates=recharge_rates
        )

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'geometry': self.geometry.to_dict(),
            'layers': [layer.to_value() for layer in self.layers],
            'affected_cells': self.affected_cells.to_dict(),
            'date_times': [dt.to_value() for dt in self.date_times],
            'recharge_rates': self.recharge_rates
        }
