import dataclasses
import pandas as pd
from scipy.interpolate import interp1d

from morpheus.common.types import Float

from morpheus.modflow.types.boundaries.Observation import DataItem, ObservationId, StartDateTime, EndDateTime, \
    RawDataItem, Observation
from morpheus.modflow.types.geometry import Point


class HeadValue(Float):
    pass


@dataclasses.dataclass
class ConstantHeadRawDataItem(RawDataItem):
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
class ConstantHeadDataItem(DataItem):
    observation_id: ObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    start_head: HeadValue
    end_head: HeadValue

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            start_date_time=StartDateTime.from_value(obj['start_date_time']),
            end_date_time=EndDateTime.from_value(obj['end_date_time']),
            start_head=HeadValue.from_value(obj['start_head']),
            end_head=HeadValue.from_value(obj['end_head'])
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'start_date_time': self.start_date_time.to_value(),
            'end_date_time': self.end_date_time.to_value(),
            'start_head': self.start_head.to_value(),
            'end_head': self.end_head.to_value()
        }


@dataclasses.dataclass
class ConstantHeadObservation(Observation):
    raw_data: list[ConstantHeadRawDataItem]

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> ConstantHeadDataItem | None:

        # In range check
        if end_date_time.to_datetime() < self.raw_data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.raw_data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.raw_data])
        heads = pd.Series([d.head.to_value() for d in self.raw_data])

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime())
        heads_interpolator = interp1d(time_series.values.astype(float), heads.values.astype(float),
                                      kind='linear', fill_value='extrapolate')
        heads = heads_interpolator(date_range.values.astype(float))

        start_head = heads.item(0)
        end_head = heads.item(-1)

        return ConstantHeadDataItem(
            observation_id=self.observation_id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            start_head=HeadValue.from_value(start_head),
            end_head=HeadValue.from_value(end_head)
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            geometry=Point.from_dict(obj['geometry']),
            raw_data=[ConstantHeadRawDataItem.from_dict(d) for d in obj['raw_data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'geometry': self.geometry.to_dict(),
            'raw_data': [d.to_dict() for d in self.raw_data]
        }
