import dataclasses
import pandas as pd

from scipy.interpolate import interp1d

from morpheus.common.types import Float
from .BoundaryInterpolationType import InterpolationType
from .Observation import ObservationId, RawDataItem, DataItem, Observation, ObservationName
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point


class SurfaceElevation(Float):
    pass


class Evapotranspiration(Float):
    pass


class ExtinctionDepth(Float):
    pass


@dataclasses.dataclass
class EvapotranspirationRawDataItem(RawDataItem):
    date_time: StartDateTime
    surface_elevation: SurfaceElevation
    evapotranspiration: Evapotranspiration
    extinction_depth: ExtinctionDepth

    @classmethod
    def default(cls, date_time: StartDateTime):
        return cls(
            date_time=date_time,
            surface_elevation=SurfaceElevation.from_float(0.0),
            evapotranspiration=Evapotranspiration.from_float(0.0),
            extinction_depth=ExtinctionDepth.from_float(0.0)
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            surface_elevation=SurfaceElevation.from_value(obj['surface_elevation']),
            evapotranspiration=Evapotranspiration.from_value(obj['evapotranspiration']),
            extinction_depth=ExtinctionDepth.from_value(obj['extinction_depth']),
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'surface_elevation': self.surface_elevation.to_value(),
            'evapotranspiration': self.evapotranspiration.to_value(),
            'extinction_depth': self.extinction_depth.to_value(),
        }


@dataclasses.dataclass
class EvapotranspirationDataItem(DataItem):
    observation_id: ObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    surface_elevation: SurfaceElevation
    evapotranspiration: Evapotranspiration
    extinction_depth: ExtinctionDepth

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            start_date_time=StartDateTime.from_value(obj['start_date_time']),
            end_date_time=EndDateTime.from_value(obj['end_date_time']),
            surface_elevation=SurfaceElevation.from_value(obj['surface_elevation']),
            evapotranspiration=Evapotranspiration.from_value(obj['evapotranspiration']),
            extinction_depth=ExtinctionDepth.from_value(obj['extinction_depth']),
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'start_date_time': self.start_date_time.to_value(),
            'end_date_time': self.end_date_time.to_value(),
            'surface_elevation': self.surface_elevation.to_value(),
            'evapotranspiration': self.evapotranspiration.to_value(),
            'extinction_depth': self.extinction_depth.to_value(),
        }


@dataclasses.dataclass
class EvapotranspirationObservation(Observation):
    data: list[EvapotranspirationRawDataItem]

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, data: list[EvapotranspirationRawDataItem], observation_id: ObservationId | None = None):
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
            data=[EvapotranspirationRawDataItem.from_dict(d) for d in obj['data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'data': [d.to_dict() for d in self.data]
        }

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime, interpolation: InterpolationType) -> EvapotranspirationDataItem | None:

        # No interpolation
        # if this is set, we are expecting that the start_date_time is present in the time series
        # no other values are used or being interpolated
        if interpolation == InterpolationType.none:
            for item in self.data:
                if item.date_time == start_date_time:
                    return EvapotranspirationDataItem(
                        observation_id=self.observation_id,
                        start_date_time=start_date_time,
                        end_date_time=end_date_time,
                        surface_elevation=item.surface_elevation,
                        evapotranspiration=item.evapotranspiration,
                        extinction_depth=item.extinction_depth
                    )

            return None

        # In range check
        if end_date_time.to_datetime() < self.data[0].date_time.to_datetime():
            return None

        if start_date_time.to_datetime() > self.data[-1].date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.data])
        surface_elevations = pd.Series([d.surface_elevation.to_value() for d in self.data])
        evapotranspirations = pd.Series([d.evapotranspiration.to_value() for d in self.data])
        extinction_depths = pd.Series([d.extinction_depth.to_value() for d in self.data])

        # Check if we need to adapt the frequency of the time series
        freq = '1D'
        if end_date_time.to_datetime() - start_date_time.to_datetime() < pd.Timedelta('1D'):
            freq = '1H'

        date_range = pd.date_range(start_date_time.to_datetime(), end_date_time.to_datetime(), freq=freq)

        # Forward fill or backward fill interpolation
        # We need to fill the missing values with the last known value
        if interpolation == InterpolationType.forward_fill:
            df = pd.DataFrame({'time_series': time_series, 'surface_elevations': surface_elevations, 'evapotranspirations': evapotranspirations, 'extinction_depths': extinction_depths})
            df = df.set_index('time_series')
            df = df.reindex(date_range, method='ffill')

            target_date_time = pd.to_datetime(start_date_time.to_value())
            surface_elevation_at_start_date_time = df.loc[target_date_time, 'surface_elevations']
            evapotranspiration_at_start_date_time = df.loc[target_date_time, 'evapotranspirations']
            extinction_depth_at_start_date_time = df.loc[target_date_time, 'extinction_depths']

            return EvapotranspirationDataItem(
                observation_id=self.observation_id,
                start_date_time=start_date_time,
                end_date_time=end_date_time,
                surface_elevation=SurfaceElevation.from_value(surface_elevation_at_start_date_time),
                evapotranspiration=Evapotranspiration.from_value(evapotranspiration_at_start_date_time),
                extinction_depth=ExtinctionDepth.from_value(extinction_depth_at_start_date_time)
            )

        # Linear or nearest interpolation
        surface_elevations_interpolator = interp1d(
            time_series.values.astype(float),
            surface_elevations.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
        surface_elevations = surface_elevations_interpolator(date_range.values.astype(float))

        evapotranspiration_interpolator = interp1d(
            time_series.values.astype(float),
            evapotranspirations.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )

        evapotranspirations = evapotranspiration_interpolator(date_range.values.astype(float))

        extinction_depths_interpolator = interp1d(
            time_series.values.astype(float),
            extinction_depths.values.astype(float),
            kind='nearest' if interpolation == InterpolationType.nearest else 'linear',
            fill_value='extrapolate'  # type: ignore
        )
        extinction_depths = extinction_depths_interpolator(date_range.values.astype(float))

        return EvapotranspirationDataItem(
            observation_id=self.observation_id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            surface_elevation=SurfaceElevation(surface_elevations.mean()),
            evapotranspiration=Evapotranspiration(evapotranspirations.mean()),
            extinction_depth=ExtinctionDepth(extinction_depths.mean()),
        )

    def as_geojson(self):
        return self.geometry.as_geojson()
