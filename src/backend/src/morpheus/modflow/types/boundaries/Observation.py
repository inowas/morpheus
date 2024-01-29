import dataclasses

from morpheus.common.types import Uuid
from morpheus.modflow.types.discretization.time.Stressperiods import StartDateTime, EndDateTime
from morpheus.modflow.types.geometry import Point


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
    def from_dict(cls, obj):
        raise NotImplementedError()

    def to_dict(self):
        raise NotImplementedError()

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime) -> DataItem | None:
        raise NotImplementedError()

    def as_geojson(self):
        return self.geometry.as_geojson()
