import dataclasses
from typing import Literal
from shapely.geometry import Polygon as ShapelyPolygon
from shapely.geometry import MultiPolygon as ShapelyMultiPolygon
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
        # Convert each polygon's coordinates to a ShapelyPolygon
        shapely_polygons = [ShapelyPolygon(poly_coords[0]) for poly_coords in self.coordinates]
        shapely_multipolygon = ShapelyMultiPolygon(shapely_polygons)
        coords = shapely_multipolygon.centroid.coords[0]
        return Point(coordinates=(coords[0], coords[1]))

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
