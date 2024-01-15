import dataclasses
from typing import Literal, Any

from .GeometryFactory import GeometryFactory
from .LineString import LineString
from .Point import Point
from .Polygon import Polygon


@dataclasses.dataclass
class Feature:
    geometry: Polygon | LineString | Point
    properties: dict[str, Any] = dataclasses.field(default_factory=dict)
    type: Literal['Feature'] = 'Feature'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'geometry': self.geometry.__geo_interface__() if self.geometry is not None else None,
        }

    @classmethod
    def from_dict(cls, obj: dict):
        geometry = GeometryFactory.from_dict(obj['geometry'])
        return cls(geometry=geometry, properties=obj['properties'], type=obj['type'])

    def to_dict(self):
        return {
            'type': self.type,
            'geometry': self.geometry.to_dict() if self.geometry is not None else None,
            'properties': self.properties
        }

    def as_geojson(self):
        return self.__geo_interface__()
