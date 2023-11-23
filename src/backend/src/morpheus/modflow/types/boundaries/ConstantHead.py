import dataclasses

import numpy as np

from morpheus.common.types import DateTime, Float
from .Boundary import BoundaryId, BoundaryType, ObservationId, Boundary
from ..discretization.spatial import GridCells
from ..geometry import Point, LineString


class StartDateTime(DateTime):
    pass


class StartHead(Float):
    pass


class EndHead(Float):
    pass


@dataclasses.dataclass
class DataItem:
    date_time: StartDateTime
    start_head: StartHead
    end_head: EndHead

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            start_head=StartHead.from_value(obj['start_head']),
            end_head=EndHead.from_value(obj['end_head'])
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'start_head': self.start_head.to_value(),
            'end_head': self.end_head.to_value()
        }


@dataclasses.dataclass
class ConstantHeadObservation:
    id: ObservationId
    geometry: Point
    raw_data: list[DataItem]

    def __init__(self, id: ObservationId, geometry: Point, raw_data: list[DataItem]):
        self.id = id
        self.geometry = geometry
        self.raw_data = raw_data

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=ObservationId.from_value(obj['id']),
            geometry=Point.from_dict(obj['geometry']),
            raw_data=[DataItem.from_dict(d) for d in obj['raw_data']]
        )

    def to_dict(self):
        return {
            'id': self.id.to_value(),
            'geometry': self.geometry.to_dict(),
            'raw_data': [d.to_dict() for d in self.raw_data]
        }

    def get_data(self, date_times: list[StartDateTime]):
        timestamps_raw = [d.date_time.to_datetime().timestamp() for d in self.raw_data]
        start_heads_raw = [d.start_head.to_value() for d in self.raw_data]
        end_heads_raw = [d.end_head.to_value() for d in self.raw_data]

        timestamps = [dt.to_datetime().timestamp() for dt in date_times]
        start_heads = np.interp(timestamps, timestamps_raw, start_heads_raw)
        end_heads = np.interp(timestamps, timestamps_raw, end_heads_raw)

        return [DataItem(
            date_time=StartDateTime.from_datetime(date_time.to_datetime()),
            start_head=StartHead.from_value(start_heads[i]),
            end_head=EndHead.from_value(end_heads[i])) for i, date_time in enumerate(date_times)]


@dataclasses.dataclass
class ConstantHead(Boundary):
    id: BoundaryId
    type: BoundaryType.constant_head()
    geometry: LineString
    affected_cells: GridCells
    observations: list[ConstantHeadObservation]

    def __init__(self, id: BoundaryId, geometry: LineString, affected_cells: GridCells,
                 observations: list[ConstantHeadObservation]):
        self.id = id
        self.type = BoundaryType.constant_head()
        self.geometry = geometry
        self.affected_cells = affected_cells
        self.observations = observations

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=BoundaryId.from_value(obj['id']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
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
