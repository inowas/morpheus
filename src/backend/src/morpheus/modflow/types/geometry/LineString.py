import dataclasses
from typing import Literal


@dataclasses.dataclass
class LineString:
    coordinates: list[tuple[float, float]]
    type: Literal['LineString'] = 'LineString'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'LineString'.lower():
            raise ValueError('Geometry Type must be a LineString')
        return cls(coordinates=obj['coordinates'])

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def as_geojson(self):
        return self.__geo_interface__()
