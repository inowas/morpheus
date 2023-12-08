import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.modflow.types.geometry import Point


class StartDateTime(DateTime):
    pass


class EndDateTime(DateTime):
    pass


class ObservationId(Uuid):
    pass


@dataclasses.dataclass
class RawDataItem:
    date_time: StartDateTime

    @classmethod
    def from_dict(cls, obj):
        raise NotImplementedError()

    def to_dict(self):
        raise NotImplementedError()


@dataclasses.dataclass
class DataItem:
    observation_id: ObservationId
    start_date_time: StartDateTime
    end_date_time: EndDateTime

    @classmethod
    def from_dict(cls, obj):
        raise NotImplementedError()

    def to_dict(self):
        raise NotImplementedError()


@dataclasses.dataclass
class Observation:
    observation_id: ObservationId
    geometry: Point
    raw_data: list[RawDataItem]

    @classmethod
    def new(cls, geometry: Point, raw_data: list[RawDataItem]):
        return cls(
            observation_id=ObservationId.new(),
            geometry=geometry,
            raw_data=raw_data
        )

    @classmethod
    def from_dict(cls, obj):
        raise NotImplementedError()

    def to_dict(self):
        raise NotImplementedError()

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> DataItem | None:
        raise NotImplementedError()

    def as_geojson(self):
        return self.geometry.as_geojson()
