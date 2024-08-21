import dataclasses
from typing import Literal
from shapely.geometry import Polygon as ShapelyPolygon
from .Point import Point


@dataclasses.dataclass
class Polygon:
    coordinates: list[list[tuple[float, float]]]
    type: Literal['Polygon'] = 'Polygon'

    def __eq__(self, other):
        return self.coordinates == other.coordinates and self.type == other.type

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'Polygon'.lower():
            raise ValueError('Geometry Type must be a Polygon')
        return cls(coordinates=obj['coordinates'])

    @classmethod
    def from_shapely_polygon(cls, shapely_polygon: ShapelyPolygon):
        coordinates = shapely_polygon.__geo_interface__["coordinates"]
        return cls(coordinates=list(map(lambda x: list(x), coordinates)))

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates,
        }

    def centroid(self) -> Point:
        return Point(coordinates=self.to_shapely_polygon().centroid.coords[0])

    def bbox(self) -> list[float]:
        return list(self.to_shapely_polygon().bounds)

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def as_geojson(self):
        return self.__geo_interface__()

    def to_shapely_polygon(self):
        return ShapelyPolygon(self.coordinates[0], holes=self.coordinates[1:])
