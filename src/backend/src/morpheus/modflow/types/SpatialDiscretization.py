import dataclasses
import numpy as np
from typing import Literal

import pygeoif
import pyproj


def as_geojson(obj):
    if hasattr(obj, '__geo_interface__'):
        return obj.__geo_interface__

    raise TypeError(f'Object of type {type(obj)} is not GeoJSON serializable')


@dataclasses.dataclass
class Polygon:
    coordinates: list[list[tuple[float, float]]]
    type: Literal['Polygon'] = 'Polygon'

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'Polygon'.lower():
            raise ValueError('Geometry Type must be a Polygon')
        return cls(
            type='Polygon',
            coordinates=obj['coordinates']
        )

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }


@dataclasses.dataclass
class BoundingBox:
    value: tuple[float, float, float, float]

    @classmethod
    def from_tuple(cls, value: tuple[float, float, float, float]):
        return cls(value=value)

    def to_tuple(self):
        return self.value


@dataclasses.dataclass
class AffectedCells:
    shape: tuple[int, int, int]
    data: list[list[list[bool]]]

    @classmethod
    def from_string(cls, data: str, shape: tuple[int, int, int]):
        nx, ny, nz = shape
        if len(data) != nx * ny * nz:
            raise ValueError('data must have exactly nx * ny * nz characters')
        return cls(
            shape=(nx, ny, nz),
            data=np.array(list(data), dtype=bool).reshape(shape).tolist()
        )

    @classmethod
    def from_dict(cls, obj: dict):
        data = np.array(obj['data'], dtype=bool)
        if data.ndim != 3:
            raise ValueError('data must be a 3-dimensional array')
        if data.shape != obj['shape']:
            raise ValueError('data.shape must match shape')

        return cls(
            shape=obj['shape'],
            data=data.tolist()
        )

    def to_dict(self):
        return {
            'shape': self.shape,
            'data': self.data
        }

    def to_string(self):
        str_data = np.array(self.data, dtype=int).flatten().tolist()
        str_data = ''.join(map(str, str_data))
        return {
            'shape': self.shape,
            'data': str_data
        }

    def get_cell(self, cell: tuple[int, int, int]) -> bool:
        try:
            return self.data[cell[0]][cell[1]][cell[2]]
        except IndexError:
            raise ValueError('cell is out of bounds')

    def get_row(self, row: tuple[int, int]) -> list[bool]:
        try:
            return self.data[row[0]][row[1]]
        except IndexError:
            raise ValueError('row is out of bounds')

    def get_layer(self, layer: tuple[int, int]) -> list[list[bool]]:
        try:
            return self.data[layer[0]]
        except IndexError:
            raise ValueError('layer is out of bounds')


@dataclasses.dataclass
class Area:
    geometry: Polygon
    bounding_box: BoundingBox
    affected_cells: AffectedCells | None = None

    @classmethod
    def from_dict(cls, obj: dict):
        try:
            geometry = Polygon.from_dict(obj['geometry'])
        except KeyError:
            raise ValueError('Geometry must be a Polygon')

        affected_cells: AffectedCells | None = None
        if obj.get('affected_cells'):
            affected_cells = AffectedCells.from_dict(obj['affected_cells'])

        bounding_box = pygeoif.shape(obj['geometry']).bounds
        if obj.get('bounding_box'):
            bounding_box = BoundingBox.from_tuple(obj['bounding_box'])

        return cls(
            geometry=geometry,
            affected_cells=affected_cells,
            bounding_box=bounding_box
        )

    @classmethod
    def from_geometry(cls, geometry: Polygon):
        return cls.from_dict({
            'geometry': geometry.to_dict()
        })

    def to_dict(self):
        return {
            'geometry': self.geometry.to_dict(),
            'bounding_box': self.bounding_box,
            'affected_cells': self.affected_cells
        }


@dataclasses.dataclass
class Grid:
    rows: list[float]
    columns: list[float]

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            rows=obj['rows'],
            columns=obj['columns'],
        )

    def to_dict(self):
        return {
            'rows': self.rows,
            'columns': self.columns,
        }

    def number_of_columns(self) -> int:
        return len(self.columns)

    def number_of_rows(self) -> int:
        return len(self.rows)


@dataclasses.dataclass(frozen=True)
class LengthUnit:
    UNDEFINED = 0
    FEET = 1
    METERS = 2
    CENTIMETERS = 3

    unit: int

    @classmethod
    def from_int(cls, number: int):
        if number < 0 or number > 3:
            raise ValueError('Length unit integer must be between 0 and 3')
        return cls(unit=number)

    @classmethod
    def from_str(cls, string: str):
        if string == 'undefined':
            return cls(cls.UNDEFINED)
        elif string == 'feet':
            return cls(cls.FEET)
        elif string == 'meters':
            return cls(cls.METERS)
        elif string == 'centimeters':
            return cls(cls.CENTIMETERS)
        else:
            raise ValueError(f'Invalid length unit: {string}')

    @classmethod
    def from_meters(cls):
        return cls.from_int(cls.METERS)

    def to_int(self):
        return self.unit

    def to_str(self):
        if self.unit == self.UNDEFINED:
            return 'undefined'
        elif self.unit == self.FEET:
            return 'feet'
        elif self.unit == self.METERS:
            return 'meters'
        elif self.unit == self.CENTIMETERS:
            return 'centimeters'
        else:
            raise ValueError(f'Invalid length unit: {self.unit}')


@dataclasses.dataclass
class Rotation(float):
    value: float

    def __init__(self, value: float):
        if value < 0 or value > 360:
            raise ValueError('Rotation must be between 0 and 360')
        self.value = value

    @classmethod
    def from_float(cls, number: float):
        return cls(value=number)

    def to_float(self):
        return self.value


@dataclasses.dataclass
class CRS:
    # everything accepted by pyproj.CRS.from_user_input(), e.g. "EPSG:4326"
    value: str

    def __init__(self, crs: str):
        try:
            pyproj.CRS.from_user_input(crs)
            self.value = crs
        except pyproj.exceptions.CRSError:
            raise ValueError('Invalid CRS')

    @classmethod
    def from_str(cls, crs: str):
        return cls(crs=crs)

    def to_str(self):
        return self.value


@dataclasses.dataclass
class Polygon:
    type: Literal['polygon']
    coordinates: list[list[tuple[float, float]]]

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            type=obj['type'],
            coordinates=obj['coordinates']
        )

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }


@dataclasses.dataclass
class BoundingBox:
    value: tuple[float, float, float, float]

    @classmethod
    def from_tuple(cls, value: tuple[float, float, float, float]):
        return cls(value=value)

    def to_tuple(self):
        return self.value


@dataclasses.dataclass
class SpatialDiscretization:
    area: Area
    grid: Grid
    length_unit: LengthUnit
    rotation: Rotation
    crs: CRS

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            area=Area.from_dict(obj['area']),
            grid=Grid.from_dict(obj['grid']),
            length_unit=LengthUnit.from_str(obj['length_unit']),
            rotation=Rotation.from_float(obj['rotation']),
            crs=CRS.from_str(obj['crs'])
        )

    def to_dict(self):
        return {
            'area': self.area.to_dict(),
            'grid': self.grid.to_dict(),
            'length_unit': self.length_unit.to_str(),
            'rotation': self.rotation.to_float(),
            'crs': self.crs.to_str()
        }
