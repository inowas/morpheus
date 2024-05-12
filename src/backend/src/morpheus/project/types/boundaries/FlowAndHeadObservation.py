import dataclasses
import pandas as pd

from scipy.interpolate import interp1d

from morpheus.common.types import Float
from .Observation import ObservationId, Observation
from ..discretization.time.Stressperiods import StartDateTime
from ..geometry import Point


class Flow(Float):
    pass


class Head(Float):
    pass


@dataclasses.dataclass
class FlowDataItem:
    observation_id: ObservationId
    date_time: StartDateTime
    flow: Flow


@dataclasses.dataclass
class HeadDataItem:
    observation_id: ObservationId
    date_time: StartDateTime
    head: Head


@dataclasses.dataclass
class FlowAndHeadRawDataItem:
    date_time: StartDateTime
    flow: Flow | None
    head: Head | None

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            flow=Flow.from_value(obj['flow']) if obj['flow'] is not None else None,
            head=Head.from_value(obj['head']) if obj['head'] is not None else None
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'flow': self.flow.to_value() if self.flow is not None else None,
            'head': self.head.to_value() if self.head is not None else None
        }


@dataclasses.dataclass
class FlowAndHeadObservation(Observation):
    raw_data: list[FlowAndHeadRawDataItem]

    @classmethod
    def new(cls, geometry: Point, raw_data: list[FlowAndHeadRawDataItem]):
        return cls(
            observation_id=ObservationId.new(),
            geometry=geometry,
            raw_data=raw_data
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            geometry=Point.from_dict(obj['geometry']),
            raw_data=[FlowAndHeadRawDataItem.from_dict(d) for d in obj['raw_data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'geometry': self.geometry.to_dict(),
            'raw_data': [d.to_dict() for d in self.raw_data]
        }

    def get_flow_data_item(self, date_time: StartDateTime) -> FlowDataItem | None:

        # In range check
        if self.raw_data[0].date_time.to_datetime() > date_time.to_datetime():
            return None

        if self.raw_data[-1].date_time.to_datetime() < date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.raw_data if d.flow is not None])
        flows = pd.Series([d.flow.to_value() for d in self.raw_data if d.flow is not None])
        if len(flows) == 0:
            return None

        date_range = pd.date_range(date_time.to_datetime(), date_time.to_datetime(), freq='1h')
        flow_interpolator = interp1d(
            time_series.values.astype(float),
            flows.values.astype(float),
            kind='linear',
            fill_value='extrapolate'  # type: ignore
        )
        interpolated_flows = flow_interpolator(date_range.values.astype(float))

        return FlowDataItem(
            observation_id=self.observation_id,
            date_time=date_time,
            flow=Flow.from_value(interpolated_flows.mean())
        )

    def get_head_data_item(self, date_time: StartDateTime) -> HeadDataItem | None:

        # In range check
        if self.raw_data[0].date_time.to_datetime() > date_time.to_datetime():
            return None

        if self.raw_data[-1].date_time.to_datetime() < date_time.to_datetime():
            return None

        time_series = pd.Series([d.date_time.to_datetime() for d in self.raw_data if d.head is not None])
        heads = pd.Series([d.head.to_value() for d in self.raw_data if d.head is not None])
        if len(heads) == 0:
            return None

        date_range = pd.date_range(date_time.to_datetime(), date_time.to_datetime(), freq='1h')
        head_interpolator = interp1d(
            time_series.values.astype(float),
            heads.values.astype(float),
            kind='linear',
            fill_value='extrapolate'  # type: ignore
        )
        interpolated_heads = head_interpolator(date_range.values.astype(float))

        return HeadDataItem(
            observation_id=self.observation_id,
            date_time=date_time,
            head=Head.from_value(interpolated_heads.mean())
        )

    def get_date_times(self) -> list[StartDateTime]:
        return [d.date_time for d in self.raw_data]

    def as_geojson(self):
        return self.geometry.as_geojson()
