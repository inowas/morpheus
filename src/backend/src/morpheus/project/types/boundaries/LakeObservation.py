import dataclasses
import pandas as pd

from scipy.interpolate import interp1d

from morpheus.common.types import Float
from .BoundaryInterpolationType import InterpolationType
from .Observation import ObservationId, ObservationValue, DataItem, Observation, ObservationName
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point


class Precipitation(Float):
    pass


class Evaporation(Float):
    pass


class Runoff(Float):
    pass


class Withdrawal(Float):
    pass


class BedLeakance(Float):
    pass


class InitialStage(Float):
    pass


@dataclasses.dataclass
class StageRange:
    min: float
    max: float

    @classmethod
    def from_dict(cls, obj):
        return cls(
            min=obj['min'],
            max=obj['max'],
        )

    def to_dict(self):
        return {
            'min': self.min,
            'max': self.max,
        }


@dataclasses.dataclass
class LakeObservationValue(ObservationValue):
    date_time: StartDateTime
    precipitation: Precipitation
    evaporation: Evaporation
    runoff: Runoff
    withdrawal: Withdrawal

    @classmethod
    def default(cls, date_time: StartDateTime):
        return cls(
            date_time=date_time,
            precipitation=Precipitation.from_float(0.0),
            evaporation=Evaporation.from_float(0.0),
            runoff=Runoff.from_float(0.0),
            withdrawal=Withdrawal.from_float(0.0)
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            precipitation=Precipitation.from_value(obj['precipitation']),
            evaporation=Evaporation.from_value(obj['evaporation']),
            runoff=Runoff.from_value(obj['runoff']),
            withdrawal=Withdrawal.from_value(obj['withdrawal']),
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'precipitation': self.precipitation.to_value(),
            'evaporation': self.evaporation.to_value(),
            'runoff': self.runoff.to_value(),
            'withdrawal': self.withdrawal.to_value(),
        }


@dataclasses.dataclass
class LakeDataItem(DataItem):
    observation_id: ObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    precipitation: Precipitation
    evaporation: Evaporation
    runoff: Runoff
    withdrawal: Withdrawal

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            start_date_time=StartDateTime.from_value(obj['start_date_time']),
            end_date_time=EndDateTime.from_value(obj['end_date_time']),
            precipitation=Precipitation.from_value(obj['precipitation']),
            evaporation=Evaporation.from_value(obj['evaporation']),
            runoff=Runoff.from_value(obj['runoff']),
            withdrawal=Withdrawal.from_value(obj['withdrawal']),
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'start_date_time': self.start_date_time.to_value(),
            'end_date_time': self.end_date_time.to_value(),
            'precipitation': self.precipitation.to_value(),
            'evaporation': self.evaporation.to_value(),
            'runoff': self.runoff.to_value(),
            'withdrawal': self.withdrawal.to_value(),
        }


@dataclasses.dataclass
class LakeObservation(Observation):
    observation_id: ObservationId
    geometry: Point
    data: list[LakeObservationValue]
    bed_leakance: BedLeakance
    initial_stage: InitialStage
    stage_range: StageRange

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, data: list[LakeObservationValue], bed_leakance: BedLeakance,
            initial_stage: InitialStage, stage_range: StageRange, observation_id: ObservationId | None = None):
        data = list({d.date_time: d for d in data}.values())
        data = sorted(data, key=lambda x: x.date_time)
        return cls(
            observation_id=observation_id or ObservationId.new(),
            observation_name=name,
            geometry=geometry,
            data=data,
            bed_leakance=bed_leakance,
            initial_stage=initial_stage,
            stage_range=stage_range,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            observation_name=ObservationName.from_value(obj['observation_name']),
            geometry=Point.from_dict(obj['geometry']),
            data=[LakeObservationValue.from_dict(d) for d in obj['data']],
            bed_leakance=BedLeakance.from_value(obj['bed_leakance']),
            initial_stage=InitialStage.from_value(obj['initial_stage']),
            stage_range=StageRange.from_dict(obj['stage_range']),
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'data': [d.to_dict() for d in self.data],
            'bed_leakance': self.bed_leakance.to_value(),
            'initial_stage': self.initial_stage.to_value(),
            'stage_range': self.stage_range.to_dict(),
        }

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime, interpolation: InterpolationType) -> LakeDataItem | None:

        # No interpolation
        # if this is set, we are expecting that the start_date_time is present in the time series
        # no other values are used or being interpolated
        if interpolation == InterpolationType.none:
            for item in self.data:
                if item.date_time == start_date_time:
                    return LakeDataItem(
                        observation_id=self.observation_id,
                        start_date_time=start_date_time,
                        end_date_time=end_date_time,
                        precipitation=item.precipitation,
                        evaporation=item.evaporation,
                        runoff=item.runoff,
                        withdrawal=item.withdrawal,
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
                    return LakeDataItem(
                        observation_id=self.observation_id,
                        start_date_time=start_date_time,
                        end_date_time=end_date_time,
                        precipitation=item.precipitation,
                        evaporation=item.evaporation,
                        runoff=item.runoff,
                        withdrawal=item.withdrawal,
                    )

                # do not process any further if the item is after the start_date_time
                if item.date_time > start_date_time:
                    break

            # return the last known value if the start_date_time is not present in the time series
            return LakeDataItem(
                observation_id=self.observation_id,
                start_date_time=start_date_time,
                end_date_time=end_date_time,
                precipitation=last_known_value.precipitation,
                evaporation=last_known_value.evaporation,
                runoff=last_known_value.runoff,
                withdrawal=last_known_value.withdrawal,
            )

        # In range check
        if end_date_time.to_datetime() < self.data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.data])
        precipitations = pd.Series([d.precipitation.to_value() for d in self.data])
        evaporations = pd.Series([d.evaporation.to_value() for d in self.data])
        runoffs = pd.Series([d.runoff.to_value() for d in self.data])
        withdrawals = pd.Series([d.withdrawal.to_value() for d in self.data])

        # Check if we need to adapt the frequency of the time series
        freq = '1D'
        if end_date_time.to_datetime() - start_date_time.to_datetime() < pd.Timedelta('1D'):
            freq = '1H'

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime(), freq=freq)

        # Linear or nearest interpolation
        precipitations = pd.Series([d.precipitation.to_value() for d in self.data])
        precipitations_interpolator = interp1d(
            time_series.values.astype(float),
            precipitations.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
        precipitations = precipitations_interpolator(date_range.values.astype(float))

        evaporations = pd.Series([d.evaporation.to_value() for d in self.data])
        evaporations_interpolator = interp1d(
            time_series.values.astype(float),
            evaporations.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
        evaporations = evaporations_interpolator(date_range.values.astype(float))

        runoffs = pd.Series([d.runoff.to_value() for d in self.data])
        runoff_interpolator = interp1d(
            time_series.values.astype(float),
            runoffs.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
        runoffs = runoff_interpolator(date_range.values.astype(float))

        withdrawals = pd.Series([d.withdrawal.to_value() for d in self.data])
        withdrawal_interpolator = interp1d(
            time_series.values.astype(float),
            withdrawals.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )

        withdrawals = withdrawal_interpolator(date_range.values.astype(float))

        return LakeDataItem(
            observation_id=self.observation_id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            precipitation=Precipitation(precipitations.mean()),
            evaporation=Evaporation(evaporations.mean()),
            runoff=Runoff(runoffs.mean()),
            withdrawal=Withdrawal(withdrawals.mean()),
        )

    def as_geojson(self):
        return self.geometry.as_geojson()
