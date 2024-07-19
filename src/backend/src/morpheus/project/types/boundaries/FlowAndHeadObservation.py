import dataclasses

from morpheus.common.types import Float
from .Observation import ObservationId, Observation, ObservationName
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
    def default(cls, date_time: StartDateTime):
        return cls(
            date_time=date_time,
            flow=None,
            head=Head.from_float(0.0)
        )

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
    data: list[FlowAndHeadRawDataItem]

    @classmethod
    def new(cls, name: ObservationName, geometry: Point, data: list[FlowAndHeadRawDataItem], observation_id: ObservationId | None = None):
        data = list({d.date_time: d for d in data}.values())
        data = sorted(data, key=lambda x: x.date_time)
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
            data=[FlowAndHeadRawDataItem.from_dict(d) for d in obj['data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'observation_name': self.observation_name.to_value(),
            'geometry': self.geometry.to_dict(),
            'data': [d.to_dict() for d in self.data]
        }

    def get_flow_data_item(self, date_time: StartDateTime) -> FlowDataItem | None:

        # In range check
        if self.data[0].date_time.to_datetime() > date_time.to_datetime():
            return None

        if self.data[-1].date_time.to_datetime() < date_time.to_datetime():
            return None

        for item in self.data:
            if item.date_time == date_time:
                if item.flow is None:
                    return None

                return FlowDataItem(
                    observation_id=self.observation_id,
                    date_time=date_time,
                    flow=item.flow
                )
        return None

    def get_head_data_item(self, date_time: StartDateTime) -> HeadDataItem | None:

        # In range check
        if self.data[0].date_time.to_datetime() > date_time.to_datetime():
            return None

        if self.data[-1].date_time.to_datetime() < date_time.to_datetime():
            return None

        for item in self.data:
            if item.date_time == date_time:
                if item.head is None:
                    return None
                return HeadDataItem(
                    observation_id=self.observation_id,
                    date_time=date_time,
                    head=item.head
                )
        return None

    def get_date_times(self) -> list[StartDateTime]:
        return [d.date_time for d in self.data]

    def as_geojson(self):
        return self.geometry.as_geojson()
