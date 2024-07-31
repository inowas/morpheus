import dataclasses
import pandas as pd
from scipy.interpolate import interp1d

from morpheus.common.types import Float
from morpheus.project.types.boundaries.BoundaryInterpolationType import InterpolationType

from morpheus.project.types.boundaries.Observation import DataItem, ObservationId, ObservationName, StartDateTime, EndDateTime, ObservationValue, Observation
from morpheus.project.types.geometry import Point


class HeadValue(Float):
    pass


@dataclasses.dataclass
class ConstantHeadObservationValue(ObservationValue):
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
    data: list[ConstantHeadObservationValue]

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, data: list[ConstantHeadObservationValue], observation_id: ObservationId | None = None):
        data = list({d.date_time: d for d in data}.values())
        data = sorted(data, key=lambda x: x.date_time)
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

        # Forward fill interpolation
        # if this is set, we are expecting that the start_date_time is present in the time series
        # if the start_date_time is not present, we are using the last known value
        if interpolation == InterpolationType.forward_fill:
            sorted_data = sorted(self.data, key=lambda x: x.date_time)
            if len(sorted_data) == 0:
                return None

            last_known_value = sorted_data[0]
            for i, item in enumerate(self.data):
                if item.date_time < start_date_time:
                    last_known_value = item

                if item.date_time == start_date_time:
                    return ConstantHeadDataItem(
                        observation_id=self.observation_id,
                        start_date_time=start_date_time,
                        end_date_time=end_date_time,
                        start_head=item.head,
                        end_head=item.head
                    )

                # do not process any further if the item is after the start_date_time
                if item.date_time > start_date_time:
                    break

            # return the last known value if the start_date_time is not present in the time series
            return ConstantHeadDataItem(
                observation_id=self.observation_id,
                start_date_time=start_date_time,
                end_date_time=end_date_time,
                start_head=last_known_value.head,
                end_head=last_known_value.head
            )

        # In range check
        if end_date_time.to_datetime() < self.data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.data])
        heads = pd.Series([d.head.to_value() for d in self.data])

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime())

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
            data=[ConstantHeadObservationValue.from_dict(d) for d in obj['data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'data': [d.to_dict() for d in self.data]
        }
