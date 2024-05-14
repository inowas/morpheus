import dataclasses
import pandas as pd

from scipy.interpolate import interp1d

from morpheus.common.types import Float
from .Observation import ObservationId, Observation, DataItem, ObservationName
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point


class Stage(Float):
    pass


class Conductance(Float):
    pass


@dataclasses.dataclass
class GeneralHeadDataItem(DataItem):
    observation_id: ObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    stage: Stage
    conductance: Conductance


@dataclasses.dataclass
class GeneralHeadRawDataItem:
    date_time: StartDateTime
    stage: Stage
    conductance: Conductance

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            stage=Stage.from_value(obj['stage']),
            conductance=Conductance.from_value(obj['conductance'])
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'stage': self.stage.to_value(),
            'conductance': self.conductance.to_value()
        }


@dataclasses.dataclass
class GeneralHeadObservation(Observation):
    raw_data: list[GeneralHeadRawDataItem]

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, raw_data: list[GeneralHeadRawDataItem]):
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
            raw_data=[GeneralHeadRawDataItem.from_dict(d) for d in obj['raw_data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'raw_data': [d.to_dict() for d in self.raw_data]
        }

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> GeneralHeadDataItem | None:

        # In range check
        if end_date_time.to_datetime() < self.raw_data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.raw_data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.raw_data])
        stages = pd.Series([d.stage.to_value() for d in self.raw_data])
        conductances = pd.Series([d.conductance.to_value() for d in self.raw_data])

        # Check if we need to adapt the frequency of the time series
        freq = '1D'
        if end_date_time.to_datetime() - start_date_time.to_datetime() < pd.Timedelta('1D'):
            freq = '1h'

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime(), freq=freq)
        stages_interpolator = interp1d(
            time_series.values.astype(float),
            stages.values.astype(float),
            kind='linear',
            fill_value='extrapolate'  # type: ignore
        )
        stages = stages_interpolator(date_range.values.astype(float))
        conductances_interpolator = interp1d(
            time_series.values.astype(float),
            conductances.values.astype(float),
            kind='linear',
            fill_value='extrapolate'  # type: ignore
        )
        conductances = conductances_interpolator(date_range.values.astype(float))

        return GeneralHeadDataItem(
            observation_id=self.observation_id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            stage=Stage.from_value(stages.mean()),
            conductance=Conductance.from_value(conductances.mean())
        )

    def as_geojson(self):
        return self.geometry.as_geojson()
