import dataclasses
from typing import Literal
from shapely.geometry import MultiPolygon as ShapelyMultiPolygon, Polygon as ShapelyPolygon
from .Point import Point


@dataclasses.dataclass
class MultiPolygon:
    coordinates: list[list[list[tuple[float, float]]]]
    type: Literal['MultiPolygon'] = 'MultiPolygon'

    def __eq__(self, other):
        return self.coordinates == other.coordinates and self.type == other.type

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def centroid(self) -> Point:
        shapely_polygon = self.to_shapely_multipolygon()
        return Point(coordinates=shapely_polygon.centroid.coords[0])

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'MultiPolygon'.lower():
            raise ValueError('Geometry Type must be a MultiPolygon')
        return cls(coordinates=obj['coordinates'])

    @classmethod
    def from_shapely_multipolygon(cls, shapely_multipolygon: ShapelyMultiPolygon):
        coordinates = shapely_multipolygon.__geo_interface__["coordinates"]
        return cls(coordinates=list(map(lambda x: list(map(lambda y: list(y), x)), coordinates)))

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def as_geojson(self):
        return self.__geo_interface__()

    def to_shapely_multipolygon(self):
        polygons = []
        for polygon in self.coordinates:
            polygons.append(ShapelyPolygon(polygon[0], holes=polygon[1:]))
        return ShapelyMultiPolygon(polygons)
