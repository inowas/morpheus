import dataclasses

import pandas as pd
from scipy.interpolate import interp1d

from morpheus.common.types import Float

from ..discretization.time.Stressperiods import EndDateTime, StartDateTime
from ..geometry import Point
from .BoundaryInterpolationType import InterpolationType
from .Observation import DataItem, Observation, ObservationId, ObservationName, ObservationValue


class RechargeRate(Float):
    pass


@dataclasses.dataclass
class RechargeObservationValue(ObservationValue):
    date_time: StartDateTime
    recharge_rate: RechargeRate

    @classmethod
    def default(cls, date_time: StartDateTime):
        return cls(date_time=date_time, recharge_rate=RechargeRate.from_float(0.0))

    @classmethod
    def from_dict(cls, obj):
        return cls(date_time=StartDateTime.from_value(obj['date_time']), recharge_rate=RechargeRate.from_value(obj['recharge_rate']))

    def to_dict(self):
        return {'date_time': self.date_time.to_value(), 'recharge_rate': self.recharge_rate.to_value()}


@dataclasses.dataclass
class RechargeDataItem(DataItem):
    observation_id: ObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    recharge_rate: RechargeRate

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            start_date_time=StartDateTime.from_value(obj['start_date_time']),
            end_date_time=EndDateTime.from_value(obj['end_date_time']),
            recharge_rate=RechargeRate.from_value(obj['recharge_rate']),
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'start_date_time': self.start_date_time.to_value(),
            'end_date_time': self.end_date_time.to_value(),
            'recharge_rate': self.recharge_rate.to_value(),
        }


@dataclasses.dataclass
class RechargeObservation(Observation):
    data: list[RechargeObservationValue]

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, data: list[RechargeObservationValue], observation_id: ObservationId | None = None):
        data = list({d.date_time: d for d in data}.values())
        data = sorted(data, key=lambda x: x.date_time)
        return cls(observation_id=observation_id or ObservationId.new(), observation_name=name, geometry=geometry, data=data)

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            observation_name=ObservationName.from_value(obj['observation_name']),
            geometry=Point.from_dict(obj['geometry']),
            data=[RechargeObservationValue.from_dict(d) for d in obj['data']],
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'data': [d.to_dict() for d in self.data],
        }

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime, interpolation: InterpolationType = InterpolationType.none) -> RechargeDataItem | None:

        # No interpolation
        # if this is set, we are expecting that the start_date_time is present in the time series
        # no other values are used or being interpolated
        if interpolation == InterpolationType.none:
            for item in self.data:
                if item.date_time == start_date_time:
                    return RechargeDataItem(observation_id=self.observation_id, start_date_time=start_date_time, end_date_time=end_date_time, recharge_rate=item.recharge_rate)
            return None

        # Forward fill interpolation
        # if this is set, we are expecting that the start_date_time is present in the time series
        # if the start_date_time is not present, we are using the last known value
        if interpolation == InterpolationType.forward_fill:
            sorted_data = sorted(self.data, key=lambda x: x.date_time)
            if len(sorted_data) == 0:
                return None

            last_known_value = sorted_data[0]
            for _i, item in enumerate(self.data):
                if item.date_time < start_date_time:
                    last_known_value = item

                if item.date_time == start_date_time:
                    return RechargeDataItem(observation_id=self.observation_id, start_date_time=start_date_time, end_date_time=end_date_time, recharge_rate=item.recharge_rate)

                # do not process any further if the item is after the start_date_time
                if item.date_time > start_date_time:
                    break

            # return the last known value if the start_date_time is not present in the time series
            return RechargeDataItem(observation_id=self.observation_id, start_date_time=start_date_time, end_date_time=end_date_time, recharge_rate=last_known_value.recharge_rate)

        # In range check
        if end_date_time.to_datetime() < self.data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.data])
        recharge_rates = pd.Series([d.recharge_rate.to_value() for d in self.data])

        # Check if we need to adapt the frequency of the time series
        freq = '1D'
        if end_date_time.to_datetime() - start_date_time.to_datetime() < pd.Timedelta('1D'):
            freq = '1H'

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime(), freq=freq)

        # Linear or nearest interpolation
        pumping_rates_interpolator = interp1d(
            time_series.values.astype(float),
            recharge_rates.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate',  # type: ignore
        )
        recharge_rates = pumping_rates_interpolator(date_range.values.astype(float))

        return RechargeDataItem(
            observation_id=self.observation_id, start_date_time=start_date_time, end_date_time=end_date_time, recharge_rate=RechargeRate.from_value(recharge_rates.mean())
        )

    def as_geojson(self):
        return self.geometry.as_geojson()
