import dataclasses
from typing import List, Sequence, Literal

from morpheus.common.types import Uuid, Float, String
from ..discretization.spatial import ActiveCells, Grid
from ..discretization.time.Stressperiods import StartDateTime, EndDateTime
from ..geometry import Point, GeometryCollection
from ..layers import LayerId


class ObservationId(Uuid):
    pass


ObservationTypeLiteral = Literal['head']


@dataclasses.dataclass(frozen=True)
class ObservationType:
    type: ObservationTypeLiteral

    def __eq__(self, other):
        return self.type == other.type

    @classmethod
    def from_str(cls, value: ObservationTypeLiteral):
        return cls(type=value)

    @classmethod
    def from_value(cls, value: ObservationTypeLiteral):
        return cls.from_str(value=value)

    @classmethod
    def head(cls):
        return cls.from_str('head')

    def to_str(self):
        return self.type

    def to_value(self):
        return self.type


class ObservationName(String):
    pass


@dataclasses.dataclass
class ObservationTags:
    value: list[str]

    @classmethod
    def from_list(cls, value: list[str]):
        return cls(value=value)

    @classmethod
    def empty(cls):
        return cls(value=[])

    @classmethod
    def from_value(cls, value: list[str]):
        return cls.from_list(value=value)

    def to_list(self):
        return self.value

    def to_value(self):
        return self.to_list()


class Head(Float):
    pass


@dataclasses.dataclass
class HeadObservationDataItem:
    date_time: StartDateTime
    head: Head

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=StartDateTime.from_value(obj['date_time']),
            head=Head.from_value(obj['head'])
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'head': self.head.to_value()
        }


@dataclasses.dataclass
class HeadObservation:
    id: ObservationId
    type: ObservationType
    name: ObservationName
    tags: ObservationTags
    geometry: Point
    affected_cells: ActiveCells
    affected_layers: list[LayerId]
    data: list[HeadObservationDataItem]
    enabled: bool = True

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

    @classmethod
    def from_geometry(cls, name: ObservationName, tags: ObservationTags, geometry: Point, grid: Grid, affected_layers: list[LayerId], data: list[HeadObservationDataItem] | None = None,
                      id: ObservationId | None = None, enabled: bool = True):
        return cls(
            id=id or ObservationId.new(),
            type=ObservationType.head(),
            name=name,
            tags=tags,
            geometry=geometry,
            affected_cells=ActiveCells.from_point(point=geometry, grid=grid),
            affected_layers=affected_layers,
            data=data or [],
            enabled=enabled,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            id=ObservationId.from_value(obj['id']),
            type=ObservationType.head(),
            name=ObservationName.from_value(obj['name']),
            tags=ObservationTags.from_value(obj['tags']),
            geometry=Point.from_dict(obj['geometry']),
            affected_cells=ActiveCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            data=[HeadObservationDataItem.from_dict(value) for value in obj['data']],
            enabled=obj['enabled'] if 'enabled' in obj else True
        )

    def to_dict(self):
        return {
            'id': self.id.to_value(),
            'type': self.type.to_value(),
            'name': self.name.to_value(),
            'tags': self.tags.to_value(),
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict(),
            'affected_layers': [layer_id.to_value() for layer_id in self.affected_layers],
            'data': [value.to_dict() for value in self.data],
            'enabled': self.enabled
        }

    def get_data_items(self, start: StartDateTime, end: EndDateTime) -> List[HeadObservationDataItem]:
        return [value for value in self.data if start.to_datetime() <= value.date_time.to_datetime() <= end.to_datetime()]

    def as_geojson(self):
        return self.geometry.as_geojson()

    def with_updated_id(self, id: ObservationId):
        return dataclasses.replace(self, id=id)

    def with_updated_type(self, type: ObservationType):
        return dataclasses.replace(self, type=type)

    def with_updated_name(self, name: ObservationName):
        return dataclasses.replace(self, name=name)

    def with_updated_tags(self, tags: ObservationTags):
        return dataclasses.replace(self, tags=tags)

    def with_updated_data(self, data: list[HeadObservationDataItem]):
        return dataclasses.replace(self, data=data)

    def with_updated_geometry(self, geometry: Point):
        return dataclasses.replace(self, geometry=geometry)

    def with_updated_affected_cells(self, affected_cells: ActiveCells):
        return dataclasses.replace(self, affected_cells=affected_cells)

    def with_updated_affected_layers(self, affected_layers: list[LayerId]):
        return dataclasses.replace(self, affected_layers=affected_layers)

    def with_updated_enabled(self, enabled: bool):
        return dataclasses.replace(self, enabled=enabled)


@dataclasses.dataclass
class ObservationCollection:
    observations: Sequence[HeadObservation]

    def __iter__(self):
        return iter(self.observations)

    def __len__(self):
        return len(self.observations)

    @classmethod
    def new(cls):
        return cls(observations=[])

    def as_geojson(self):
        return GeometryCollection(geometries=[observation.geometry for observation in self.observations]).as_geojson()

    def get_observation(self, id: ObservationId) -> HeadObservation | None:
        return next((observation for observation in self.observations if observation.id == id), None)

    def has_observation(self, id: ObservationId) -> bool:
        return any(observation.id == id for observation in self.observations)

    def with_added_observation(self, observation: HeadObservation):
        return ObservationCollection(observations=[*self.observations, observation])

    def with_updated_observation(self, observation: HeadObservation):
        return ObservationCollection(observations=[observation if observation.id == obs.id else obs for obs in self.observations])

    def with_removed_observation(self, id: ObservationId):
        return ObservationCollection(observations=[obs for obs in self.observations if obs.id != id])

    @classmethod
    def from_dict(cls, collection: list[dict]):
        observations = [HeadObservation.from_dict(item) for item in collection]
        return cls(observations=observations)

    def to_dict(self):
        return [observation.to_dict() for observation in self.observations]
