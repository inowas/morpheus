import dataclasses
from typing import Literal

from morpheus.modflow.types.SpatialDiscretization import Point, AffectedCells


@dataclasses.dataclass(frozen=True)
class BoundaryId:
    value: str

    @classmethod
    def from_str(cls, value: str):
        return cls(value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass(frozen=True)
class BoundaryType:
    type: Literal['well', 'river', 'drain', 'general_head', 'recharge', 'constant_head', 'no_flow']

    @classmethod
    def from_str(cls, value: Literal['well', 'river', 'drain', 'general_head', 'recharge', 'constant_head', 'no_flow']):
        return cls(type=value)


@dataclasses.dataclass(frozen=True)
class Boundary:
    id: BoundaryId
    type: BoundaryType

    @classmethod
    def from_dict(cls, obj):
        return cls(
            type=obj['type']
        )

    def to_dict(self):
        return {
            'type': self.type
        }


@dataclasses.dataclass(frozen=True)
class PumpingRates:
    date_times: list[str]
    pumping_rates: list[float]


@dataclasses.dataclass(frozen=True)
class WellBoundary(Boundary):
    id: BoundaryId
    type: BoundaryType.from_str('well')
    geometry: Point
    affected_cells: AffectedCells
    pumping_rates: PumpingRates

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=obj['id'],
            type=obj['type'],
            geometry=Point.from_dict(obj['geometry']),
            affected_cells=AffectedCells.from_dict(obj['affected_cells']),
            pumping_rates=PumpingRates(
                date_times=obj['pumping_rates']['date_times'],
                pumping_rates=obj['pumping_rates']['pumping_rates']
            )
        )

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict(),
            'pumping_rates': {
                'date_times': self.pumping_rates.date_times,
                'pumping_rates': self.pumping_rates.pumping_rates
            }
        }


@dataclasses.dataclass
class BoundaryCollection:
    boundaries: list[Boundary]

    @classmethod
    def new(cls):
        return cls(boundaries=[])

    @classmethod
    def from_list(cls, collection: list):
        return cls(boundaries=[Boundary.from_dict(b) for b in collection])

    def to_list(self):
        return [b.to_dict() for b in self.boundaries]
