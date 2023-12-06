import dataclasses
import numpy as np
import pandas as pd

from scipy.interpolate import interp1d

from morpheus.common.types import Float, Uuid
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point


class ConstantHeadObservationId(Uuid):
    pass


class StartHead(Float):
    pass


class EndHead(Float):
    pass


@dataclasses.dataclass
class MeanDataItem:
    observation_id: ConstantHeadObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    start_head: StartHead
    end_head: EndHead


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
    id: ConstantHeadObservationId
    geometry: Point
    raw_data: list[DataItem]

    def __init__(self, id: ConstantHeadObservationId, geometry: Point, raw_data: list[DataItem]):
        self.id = id
        self.geometry = geometry
        self.raw_data = raw_data

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=ConstantHeadObservationId.from_value(obj['id']),
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

    def get_mean_data(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> MeanDataItem | None:

        # In range check
        if end_date_time.to_datetime() < self.raw_data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.raw_data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.raw_data])
        start_heads = pd.Series([d.start_head.to_value() for d in self.raw_data])
        end_heads = pd.Series([d.end_head.to_value() for d in self.raw_data])

        # Check if we need to adapt the frequency of the time series
        freq = '1D'
        if end_date_time.to_datetime() - start_date_time.to_datetime() < pd.Timedelta('1D'):
            freq = '1H'

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime(), freq=freq)

        # create scipy's interp1d function to fill missing values
        start_heads_interpolator = interp1d(time_series.values.astype(float), start_heads.values.astype(float),
                                            kind='linear', fill_value='extrapolate')
        start_heads = start_heads_interpolator(date_range.values.astype(float))

        end_heads_interpolator = interp1d(time_series.values.astype(float), end_heads.values.astype(float),
                                          kind='linear', fill_value='extrapolate')
        end_heads = end_heads_interpolator(date_range.values.astype(float))

        return MeanDataItem(
            observation_id=self.id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            start_head=StartHead.from_value(start_heads.mean()),
            end_head=EndHead.from_value(end_heads.mean())
        )

    def as_geojson(self):
        return self.geometry.as_geojson()
