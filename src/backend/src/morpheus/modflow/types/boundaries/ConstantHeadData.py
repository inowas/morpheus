import dataclasses
import pandas as pd

from scipy.interpolate import interp1d

from morpheus.common.types import Float, Uuid
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point


class ObservationId(Uuid):
    pass


class HeadValue(Float):
    pass


class EndHead(Float):
    pass


@dataclasses.dataclass
class ConstantHeadDataItem:
    observation_id: ObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    start_head: HeadValue
    end_head: EndHead


@dataclasses.dataclass
class DataItem:
    date_time: StartDateTime
    head: HeadValue

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            head=HeadValue.from_value(obj['head'])
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'head': self.head.to_value()
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
    def new(cls, geometry: Point, raw_data: list[DataItem]):
        return cls(
            id=ObservationId.new(),
            geometry=geometry,
            raw_data=raw_data
        )

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

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> ConstantHeadDataItem | None:

        # In range check
        if end_date_time.to_datetime() < self.raw_data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.raw_data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.raw_data])
        heads = pd.Series([d.head.to_value() for d in self.raw_data])

        # Check if we need to adapt the frequency of the time series
        freq = '1D'
        if end_date_time.to_datetime() - start_date_time.to_datetime() < pd.Timedelta('1D'):
            freq = '1H'

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime())
        heads_interpolator = interp1d(time_series.values.astype(float), heads.values.astype(float),
                                      kind='linear', fill_value='extrapolate')
        heads = heads_interpolator(date_range.values.astype(float))

        start_head = heads.item(0)
        end_head = heads.item(-1)

        return ConstantHeadDataItem(
            observation_id=self.id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            start_head=HeadValue.from_value(start_head),
            end_head=EndHead.from_value(end_head)
        )

    def as_geojson(self):
        return self.geometry.as_geojson()
