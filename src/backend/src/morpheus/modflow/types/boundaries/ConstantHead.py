import dataclasses
import numpy as np
import pandas as pd
from scipy.interpolate import interp1d

from morpheus.common.types import Float
from .Boundary import BoundaryId, BoundaryType, ObservationId, Boundary, BoundaryName
from ..discretization.spatial import GridCells, Grid
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point, LineString
from ..soil_model import LayerId


class StartHead(Float):
    pass


class EndHead(Float):
    pass


@dataclasses.dataclass
class MeanDataItem:
    observation_id: ObservationId
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
    id: ObservationId
    geometry: Point
    raw_data: list[DataItem]

    def __init__(self, id: ObservationId, geometry: Point, raw_data: list[DataItem]):
        self.id = id
        self.geometry = geometry
        self.raw_data = raw_data

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=ObservationId.from_value(obj['id']),
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


@dataclasses.dataclass
class ConstantHead(Boundary):
    id: BoundaryId
    type: BoundaryType.constant_head()
    name: BoundaryName
    geometry: LineString
    affected_cells: GridCells
    affected_layers: list[LayerId]
    observations: list[ConstantHeadObservation]
    enabled = True

    def __init__(self, id: BoundaryId, name: BoundaryName, geometry: LineString, affected_cells: GridCells,
                 affected_layers: list[LayerId], observations: list[ConstantHeadObservation], enabled: bool = True):
        btype = BoundaryType.constant_head()
        super().__init__(id, btype, name, enabled)
        self.id = id
        self.type = btype
        self.name = name
        self.geometry = geometry
        self.affected_cells = affected_cells
        self.affected_layers = affected_layers
        self.observations = observations

    @classmethod
    def from_geometry(cls, name: BoundaryName, geometry: LineString, grid: Grid, affected_layers: list[LayerId],
                      observations: list[ConstantHeadObservation] | None = None):  # -> ConstantHead:

        affected_cells = GridCells.from_linestring(linestring=geometry, grid=grid)
        if observations is None or len(observations) == 0:
            observations = [ConstantHeadObservation(
                id=ObservationId.new(),
                geometry=Point(coordinates=geometry.coordinates[0]),
                raw_data=[]
            )]

        return cls(
            id=BoundaryId.new(),
            name=name,
            geometry=geometry,
            affected_cells=affected_cells,
            affected_layers=affected_layers,
            observations=observations,
            enabled=True
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=BoundaryId.from_value(obj['id']),
            name=BoundaryName.from_value(obj['name']),
            geometry=LineString.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            observations=[ConstantHeadObservation.from_dict(p) for p in obj['observation_points']],
            enabled=obj['enabled']
        )

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'name': self.name.to_value(),
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict(),
            'affected_layers': [layer_id.to_value() for layer_id in self.affected_layers],
            'observation_points': [observation.to_dict() for observation in self.observations],
            'enabled': self.enabled
        }

    def number_of_observations(self):
        return len(self.observations)

    def get_observations(self):
        return self.observations

    def get_observation(self, index: int):
        return self.observations[index]

    def get_observation_by_id(self, id: ObservationId):
        for observation in self.observations:
            if observation.id == id:
                return observation
        return None

    def as_geojson(self):
        return self.geometry.as_geojson()

    def get_mean_data(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> list[MeanDataItem]:
        return [observation.get_mean_data(start_date_time, end_date_time) for observation in self.observations]
