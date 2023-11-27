import dataclasses
from typing import Literal

from .GeometryFactory import GeometryFactory
from .LineString import LineString
from .Point import Point
from .Polygon import Polygon


@dataclasses.dataclass
class Feature:
    geometry: list[Polygon | LineString | Point]
    type: Literal['Feature'] = 'Feature'
    properties: dict = dataclasses.field(default_factory=dict)

    def __geo_interface__(self):
        return {
            'type': self.type,
            'geometries': [geometry.__geo_interface__() for geometry in self.geometries]
        }

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'GeometryCollection'.lower():
            raise ValueError('Geometry Type must be a GeometryCollection')
        return cls(geometries=[GeometryFactory.from_dict(geometry) for geometry in obj['geometries']])

    def to_dict(self):
        return {
            'type': self.type,
            'geometries': [geometry.to_dict() for geometry in self.geometries]
        }

    def as_geojson(self):
        return self.__geo_interface__()
