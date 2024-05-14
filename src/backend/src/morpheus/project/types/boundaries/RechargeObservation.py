import dataclasses
import pandas as pd

from scipy.interpolate import interp1d

from morpheus.common.types import Float
from .Observation import ObservationId, RawDataItem, DataItem, Observation, ObservationName
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point


class RechargeRate(Float):
    pass


@dataclasses.dataclass
class RechargeRawDataItem(RawDataItem):
    date_time: StartDateTime
    recharge_rate: RechargeRate

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            recharge_rate=RechargeRate.from_value(obj['recharge_rate'])
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'recharge_rate': self.recharge_rate.to_value()
        }


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
            recharge_rate=RechargeRate.from_value(obj['recharge_rate'])
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'start_date_time': self.start_date_time.to_value(),
            'end_date_time': self.end_date_time.to_value(),
            'recharge_rate': self.recharge_rate.to_value()
        }


@dataclasses.dataclass
class RechargeObservation(Observation):
    raw_data: list[RechargeRawDataItem]

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, raw_data: list[RechargeRawDataItem]):
        return cls(
            observation_id=ObservationId.new(),
            observation_name=name,
            geometry=geometry,
            raw_data=raw_data
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            observation_name=ObservationName.from_value(obj['observation_name']),
            geometry=Point.from_dict(obj['geometry']),
            raw_data=[RechargeRawDataItem.from_dict(d) for d in obj['raw_data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'raw_data': [d.to_dict() for d in self.raw_data]
        }

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> RechargeDataItem | None:

        # In range check
        if end_date_time.to_datetime() < self.raw_data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.raw_data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.raw_data])
        recharge_rates = pd.Series([d.recharge_rate.to_value() for d in self.raw_data])

        # Check if we need to adapt the frequency of the time series
        freq = '1D'
        if end_date_time.to_datetime() - start_date_time.to_datetime() < pd.Timedelta('1D'):
            freq = '1H'

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime(), freq=freq)
        pumping_rates_interpolator = interp1d(
            time_series.values.astype(float),
            recharge_rates.values.astype(float),
            kind='linear',
            fill_value='extrapolate'  # type: ignore
        )
        recharge_rates = pumping_rates_interpolator(date_range.values.astype(float))

        return RechargeDataItem(
            observation_id=self.observation_id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            recharge_rate=RechargeRate.from_value(recharge_rates.mean())
        )

    def as_geojson(self):
        return self.geometry.as_geojson()
