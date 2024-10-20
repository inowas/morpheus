import dataclasses

from morpheus.common.types import Uuid, String
from morpheus.project.types.boundaries.BoundaryInterpolationType import InterpolationType
from morpheus.project.types.discretization.time.Stressperiods import StartDateTime, EndDateTime
from morpheus.project.types.geometry import Point


class ObservationId(Uuid):
    pass


class ObservationName(String):
    @classmethod
    def default(cls):
        return cls.from_str(value='Observation Point 1')


@dataclasses.dataclass
class ObservationValue:
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
    observation_name: ObservationName
    geometry: Point
    data: list[ObservationValue]

    @classmethod
    def from_dict(cls, obj):
        raise NotImplementedError()

    def to_dict(self):
        raise NotImplementedError()

    def get_data_item(self, start_date_time: StartDateTime, end_date_time: EndDateTime, interpolation: InterpolationType) -> DataItem | None:
        raise NotImplementedError()

    def as_geojson(self):
        return self.geometry.as_geojson()

    def clone(self):
        return dataclasses.replace(self, observation_id=ObservationId.new())

    def with_updated_name(self, name: ObservationName):
        return dataclasses.replace(self, observation_name=name)

    def with_updated_geometry(self, geometry: Point):
        return dataclasses.replace(self, geometry=geometry)

    def with_added_value(self, data_item: ObservationValue):
        # if there is an item with the same date_time, delete it before adding the new one
        new_data = [item for item in self.data if item.date_time != data_item.date_time]
        # add the new item
        new_data.append(data_item)
        # sort the data by date_time
        new_data.sort(key=lambda x: x.date_time)
        return dataclasses.replace(self, data=new_data)

    def with_updated_values(self, data: list[ObservationValue]):
        return dataclasses.replace(self, data=data)
