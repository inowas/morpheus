import dataclasses
from typing import Literal
from shapely.geometry import MultiPolygon as ShapelyMultiPolygon
from .Point import Point


@dataclasses.dataclass
class MultiPolygon:
    coordinates: list[list[list[tuple[float, float]]]]
    type: Literal['MultiPolygon'] = 'MultiPolygon'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def centroid(self) -> Point:
        shapely_polygon = ShapelyMultiPolygon(self.coordinates[0])
        return Point(coordinates=shapely_polygon.centroid.coords[0])

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'MultiPolygon'.lower():
            raise ValueError('Geometry Type must be a MultiPolygon')
        return cls(coordinates=obj['coordinates'])

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def as_geojson(self):
        return self.__geo_interface__()
