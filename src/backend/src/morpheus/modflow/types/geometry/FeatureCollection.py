import dataclasses
from typing import Literal
from .Feature import Feature


@dataclasses.dataclass
class FeatureCollection:
    features: list[Feature]
    type: Literal['FeatureCollection'] = 'FeatureCollection'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'features': [feature.__geo_interface__() for feature in self.features if feature.geometry is not None]
        }

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'FeatureCollection'.lower():
            raise ValueError('Geometry Type must be a FeatureCollection')
        return cls(features=[Feature.from_dict(feature) for feature in obj['features']])

    def to_dict(self):
        return {
            'type': self.type,
            'features': [feature.to_dict() for feature in self.features]
        }

    def as_geojson(self):
        return self.__geo_interface__()
