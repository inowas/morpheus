import dataclasses
from typing import Literal, List

from morpheus.common.types import Uuid, String, DateTime, Float

from ..discretization.spatial import GridCells, Grid
from ..geometry import Point, GeometryCollection
from ..soil_model import LayerId


class ObservationId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class ObservationType:
    type: Literal['head_observation']

    def __eq__(self, other):
        return self.type == other.type

    @classmethod
    def from_str(cls, value: Literal['head_observation']):
        return cls(type=value)

    @classmethod
    def from_value(cls, value: Literal['head_observation']):
        return cls.from_str(value=value)

    @classmethod
    def head_observation(cls):
        return cls.from_str(value='head_observation')


class ObservationName(String):
    pass


class StartDateTime(DateTime):
    pass


class EndDateTime(DateTime):
    pass


class ObservationDateTime(DateTime):
    pass


class HeadValue(Float):
    pass


@dataclasses.dataclass
class HeadObservationDataItem:
    date_time: ObservationDateTime
    head_value: HeadValue

    @classmethod
    def from_dict(cls, obj):
        return cls(
            date_time=ObservationDateTime.from_value(obj['date_time']),
            head_value=HeadValue.from_value(obj['head_value'])
        )

    def to_dict(self):
        return {
            'date_time': self.date_time.to_value(),
            'head_value': self.head_value.to_value()
        }


@dataclasses.dataclass
class HeadObservation:
    observation_id: ObservationId
    type: ObservationType
    name: ObservationName
    geometry: Point
    affected_cells: GridCells
    affected_layers: list[LayerId]
    raw_data: list[HeadObservationDataItem]

    def __eq__(self, other):
        return self.to_dict() == other.to_dict()

    @classmethod
    def from_geometry(cls, name: ObservationName, geometry: Point, grid: Grid, affected_layers: list[LayerId],
                      raw_data: list[HeadObservationDataItem] | None = None):
        return cls(
            observation_id=ObservationId.new(),
            type=ObservationType.head_observation(),
            name=name,
            geometry=geometry,
            affected_cells=GridCells.from_point(point=geometry, grid=grid),
            affected_layers=affected_layers,
            raw_data=raw_data or []
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            observation_id=ObservationId.from_value(obj['observation_id']),
            type=ObservationType.from_value(obj['type']),
            name=ObservationName.from_value(obj['name']),
            geometry=Point.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells']),
            affected_layers=[LayerId.from_value(layer_id) for layer_id in obj['affected_layers']],
            raw_data=[HeadObservationDataItem.from_dict(value) for value in obj['raw_data']]
        )

    def to_dict(self):
        return {
            'observation_id': self.observation_id.to_value(),
            'type': self.type.type,
            'name': self.name.to_value(),
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict(),
            'affected_layers': [layer_id.to_value() for layer_id in self.affected_layers],
            'raw_data': [value.to_dict() for value in self.raw_data]
        }

    def get_data_items(self, start: StartDateTime, end: EndDateTime) -> List[HeadObservationDataItem]:
        return [value for value in self.raw_data if
                start.to_datetime() <= value.date_time.to_datetime() <= end.to_datetime()]

    def as_geojson(self):
        return self.geometry.as_geojson()


@dataclasses.dataclass
class ObservationCollection:
    observations: list[HeadObservation]

    def __iter__(self):
        return iter(self.observations)

    def __len__(self):
        return len(self.observations)

    @classmethod
    def new(cls):
        return cls(observations=[])

    def as_geojson(self):
        return GeometryCollection(geometries=[observation.geometry for observation in self.observations]).as_geojson()

    def add_observation(self, observation: HeadObservation):
        self.observations.append(observation)

    def update_observation(self, update: HeadObservation):
        self.observations = [observation if observation.observation_id != update.observation_id
                             else update for observation in self.observations]

    def remove_observation(self, observation: HeadObservation):
        self.observations = [obs for obs in self.observations if obs.observation_id != observation.observation_id]

    @classmethod
    def from_dict(cls, collection: list[dict]):
        observations = [HeadObservation.from_dict(item) for item in collection]
        return cls(observations=observations)

    def to_dict(self):
        return [observation.to_dict() for observation in self.observations]
