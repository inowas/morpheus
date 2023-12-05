from .Point import Point
from .LineString import LineString
from .Polygon import Polygon


class GeometryFactory:
    @staticmethod
    def from_dict(obj: dict):
        if obj['type'] == 'Polygon':
            return Polygon.from_dict(obj)
        elif obj['type'] == 'LineString':
            return LineString.from_dict(obj)
        elif obj['type'] == 'Point':
            return Point.from_dict(obj)
        else:
            raise ValueError('Invalid geometry type')
