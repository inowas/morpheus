import dataclasses
from typing import Literal
from shapely.geometry import Polygon as ShapelyPolygon
from .Point import Point


@dataclasses.dataclass
class Polygon:
    coordinates: list[list[tuple[float, float]]]
    type: Literal['Polygon'] = 'Polygon'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def centroid(self) -> Point:
        shapely_polygon = ShapelyPolygon(self.coordinates[0])
        return Point(coordinates=shapely_polygon.centroid.coords[0])

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'Polygon'.lower():
            raise ValueError('Geometry Type must be a Polygon')
        return cls(coordinates=obj['coordinates'])

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def as_geojson(self):
        return self.__geo_interface__()