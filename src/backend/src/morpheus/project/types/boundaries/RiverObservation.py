import dataclasses
import pandas as pd

from scipy.interpolate import interp1d

from morpheus.common.types import Float
from .BoundaryInterpolationType import InterpolationType
from .Observation import ObservationId, RawDataItem, DataItem, Observation, ObservationName
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point


class RiverbedBottom(Float):
    pass


class RiverStage(Float):
    pass


class Conductance(Float):
    pass


@dataclasses.dataclass
class RiverRawDataItem(RawDataItem):
    date_time: StartDateTime
    river_stage: RiverStage
    riverbed_bottom: RiverbedBottom
    conductance: Conductance

    @classmethod
    def default(cls, date_time: StartDateTime):
        return cls(
            date_time=date_time,
            river_stage=RiverStage.from_float(0.0),
            riverbed_bottom=RiverbedBottom.from_float(0.0),
            conductance=Conductance.from_float(0.0)
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            river_stage=RiverStage.from_value(obj['river_stage']),
            riverbed_bottom=RiverbedBottom.from_value(obj['riverbed_bottom']),
            conductance=Conductance.from_value(obj['conductance'])
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'river_stage': self.river_stage.to_value(),
            'riverbed_bottom': self.riverbed_bottom.to_value(),
            'conductance': self.conductance.to_value()
        }


@dataclasses.dataclass
class RiverDataItem(DataItem):
    observation_id: ObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    river_stage: RiverStage
    riverbed_bottom: RiverbedBottom
    conductance: Conductance

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            start_date_time=StartDateTime.from_value(obj['start_date_time']),
            end_date_time=EndDateTime.from_value(obj['end_date_time']),
            river_stage=RiverStage.from_value(obj['river_stage']),
            riverbed_bottom=RiverbedBottom.from_value(obj['riverbed_bottom']),
            conductance=Conductance.from_value(obj['conductance'])
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'start_date_time': self.start_date_time.to_value(),
            'end_date_time': self.end_date_time.to_value(),
            'river_stage': self.river_stage.to_value(),
            'riverbed_bottom': self.riverbed_bottom.to_value(),
            'conductance': self.conductance.to_value()
        }


@dataclasses.dataclass
class RiverObservation(Observation):
    data: list[RiverRawDataItem]

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, data: list[RiverRawDataItem], observation_id: ObservationId | None = None):
        return cls(
            observation_id=observation_id or ObservationId.new(),
            observation_name=name,
            geometry=geometry,
            data=data
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            observation_name=ObservationName.from_value(obj['observation_name']),
            geometry=Point.from_dict(obj['geometry']),
            data=[RiverRawDataItem.from_dict(d) for d in obj['data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'data': [d.to_dict() for d in self.data]
        }

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime, interpolation: InterpolationType) -> RiverDataItem | None:

        # No interpolation
        # if this is set, we are expecting that the start_date_time is present in the time series
        # no other values are used or being interpolated
        if interpolation == InterpolationType.none:
            for item in self.data:
                if item.date_time == start_date_time:
                    return RiverDataItem(
                        observation_id=self.observation_id,
                        start_date_time=start_date_time,
                        end_date_time=end_date_time,
                        river_stage=item.river_stage,
                        riverbed_bottom=item.riverbed_bottom,
                        conductance=item.conductance
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
                    return RiverDataItem(
                        observation_id=self.observation_id,
                        start_date_time=start_date_time,
                        end_date_time=end_date_time,
                        river_stage=item.river_stage,
                        riverbed_bottom=item.riverbed_bottom,
                        conductance=item.conductance
                    )

                # do not process any further if the item is after the start_date_time
                if item.date_time > start_date_time:
                    break

            # return the last known value if the start_date_time is not present in the time series
            return RiverDataItem(
                observation_id=self.observation_id,
                start_date_time=start_date_time,
                end_date_time=end_date_time,
                river_stage=last_known_value.river_stage,
                riverbed_bottom=last_known_value.riverbed_bottom,
                conductance=last_known_value.conductance
            )

        # if interpolation is set, we need to interpolate the values
        # In range check
        if end_date_time.to_datetime() < self.data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.data])
        river_stages = pd.Series([d.river_stage.to_value() for d in self.data])
        riverbed_bottoms = pd.Series([d.riverbed_bottom.to_value() for d in self.data])
        conductances = pd.Series([d.conductance.to_value() for d in self.data])

        # Check if we need to adapt the frequency of the time series
        freq = '1D'
        if end_date_time.to_datetime() - start_date_time.to_datetime() < pd.Timedelta('1D'):
            freq = '1H'

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime(), freq=freq)

        # Linear or nearest interpolation
        river_stages_interpolator = interp1d(
            time_series.values.astype(float),
            river_stages.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
        river_stages = river_stages_interpolator(date_range.values.astype(float))
        river_stage = RiverStage.from_value(river_stages.mean())

        riverbed_bottoms_interpolator = interp1d(
            time_series.values.astype(float),
            riverbed_bottoms.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
        riverbed_bottoms = riverbed_bottoms_interpolator(date_range.values.astype(float))
        riverbed_bottom = RiverbedBottom.from_value(riverbed_bottoms.mean())

        conductances_interpolator = interp1d(
            time_series.values.astype(float),
            conductances.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
        conductances = conductances_interpolator(date_range.values.astype(float))
        conductance = Conductance.from_value(conductances.mean())

        return RiverDataItem(
            observation_id=self.observation_id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            river_stage=river_stage,
            riverbed_bottom=riverbed_bottom,
            conductance=conductance
        )

    def as_geojson(self):
        return self.geometry.as_geojson()
