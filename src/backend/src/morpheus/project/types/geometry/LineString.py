import dataclasses
from typing import Literal
from shapely.geometry import LineString as ShapelyLineString, Point as ShapelyPoint

from .Point import Point


@dataclasses.dataclass
class LineString:
    coordinates: list[tuple[float, float]]
    type: Literal['LineString'] = 'LineString'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def __eq__(self, other):
        return self.coordinates == other.coordinates and self.type == other.type

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'LineString'.lower():
            raise ValueError('Geometry Type must be a LineString')
        return cls(coordinates=obj['coordinates'])

    @classmethod
    def from_shapely_linestring(cls, shapely_linestring: ShapelyLineString):
        coordinates = shapely_linestring.__geo_interface__['coordinates']
        return cls(coordinates=list(coordinates))

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def as_geojson(self):
        return self.__geo_interface__()

    def nearest_point(self, point: Point) -> Point:
        shapely_line = ShapelyLineString(self.coordinates)
        shapely_point = ShapelyPoint(point.coordinates)
        nearest_shapely_point_on_linestring = shapely_line.interpolate(shapely_line.project(shapely_point))
        coords = nearest_shapely_point_on_linestring.coords[0]
        nearest_point = Point(coordinates=(coords[0], coords[1]))
        return nearest_point

    def to_shapely_linestring(self):
        return ShapelyLineString(self.coordinates)
