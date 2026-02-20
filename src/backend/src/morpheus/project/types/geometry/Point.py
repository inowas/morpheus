import dataclasses
from typing import Literal


@dataclasses.dataclass
class Point:
    coordinates: tuple[float, float]
    type: Literal['Point'] = 'Point'

    def __eq__(self, other):
        return self.coordinates == other.coordinates and self.type == other.type

    def __geo_interface__(self):
        return {'type': self.type, 'coordinates': self.coordinates}

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'Point'.lower():
            raise ValueError('Geometry Type must be a Point')
        return cls(coordinates=obj['coordinates'])

    @classmethod
    def from_shapely_point(cls, shapely_point):
        return cls(coordinates=shapely_point.coords[0])

    @classmethod
    def from_wgs84(cls, x: float, y: float):
        return cls(coordinates=(x, y))

    def to_dict(self):
        return {'type': self.type, 'coordinates': self.coordinates}

    def as_geojson(self):
        return self.__geo_interface__()

    def to_shapely_point(self):
        return self.coordinates
