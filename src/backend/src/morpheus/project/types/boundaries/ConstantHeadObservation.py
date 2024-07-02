import dataclasses
import pandas as pd
from scipy.interpolate import interp1d

from morpheus.common.types import Float
from morpheus.project.types.boundaries.BoundaryInterpolationType import InterpolationType

from morpheus.project.types.boundaries.Observation import DataItem, ObservationId, StartDateTime, EndDateTime, RawDataItem, Observation
from morpheus.project.types.geometry import Point
from morpheus.project.types.observations.Observation import ObservationName


class HeadValue(Float):
    pass


@dataclasses.dataclass
class ConstantHeadRawDataItem(RawDataItem):
    date_time: StartDateTime
    head: HeadValue

    @classmethod
    def default(cls, date_time: StartDateTime):
        return cls(
            date_time=date_time,
            head=HeadValue.from_float(0.0)
        )

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
    data: list[ConstantHeadRawDataItem]

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, data: list[ConstantHeadRawDataItem], observation_id: ObservationId | None = None):
        return cls(
            observation_id=observation_id or ObservationId.new(),
            observation_name=name,
            geometry=geometry,
            data=data
        )

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime, interpolation: InterpolationType) -> ConstantHeadDataItem | None:

        # No interpolation
        # if this is set, we are expecting that the start_date_time is present in the time series
        # no other values are used or being interpolated
        if interpolation == InterpolationType.none:
            for item in self.data:
                if item.date_time == start_date_time:
                    return ConstantHeadDataItem(
                        observation_id=self.observation_id,
                        start_date_time=start_date_time,
                        end_date_time=end_date_time,
                        start_head=item.head,
                        end_head=item.head
                    )
            return None

        # In range check
        if end_date_time.to_datetime() < self.data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.data])
        heads = pd.Series([d.head.to_value() for d in self.data])

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime())

        # Forward fill or backward fill interpolation
        # We need to fill the missing values with the last known value
        if interpolation == InterpolationType.forward_fill:
            df = pd.DataFrame({'time_series': time_series, 'heads': heads})
            df = df.set_index('time_series')
            df = df.reindex(date_range, method='ffill')

            head_at_start_date_time = df.loc[pd.to_datetime(start_date_time.to_value()), 'heads']
            head_at_end_date_time = df.loc[pd.to_datetime(end_date_time.to_value()), 'heads']

            return ConstantHeadDataItem(
                observation_id=self.observation_id,
                start_date_time=start_date_time,
                end_date_time=end_date_time,
                start_head=HeadValue.from_value(head_at_start_date_time),
                end_head=HeadValue.from_value(head_at_end_date_time)
            )

        # Linear or nearest interpolation
        heads_interpolator = interp1d(
            time_series.values.astype(float),
            heads.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
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
            observation_name=ObservationName.from_value(obj['observation_name']),
            geometry=Point.from_dict(obj['geometry']),
            data=[ConstantHeadRawDataItem.from_dict(d) for d in obj['data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'data': [d.to_dict() for d in self.data]
        }
