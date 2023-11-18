import dataclasses
from typing import Literal, TypedDict

import numpy as np
import pyproj


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


@dataclasses.dataclass
class Point:
    coordinates: tuple[float, float]
    type: Literal['Point'] = 'Point'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'Point'.lower():
            raise ValueError('Geometry Type must be a Point')
        return cls(coordinates=obj['coordinates'])

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    def as_geojson(self):
        return self.__geo_interface__()


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


@dataclasses.dataclass
class Polygon:
    coordinates: list[list[tuple[float, float]]]
    type: Literal['Polygon'] = 'Polygon'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

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


@dataclasses.dataclass
class GeometryCollection:
    geometries: list[Polygon | LineString | Point]
    type: Literal['GeometryCollection'] = 'GeometryCollection'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'geometries': [geometry.__geo_interface__() for geometry in self.geometries]
        }

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'GeometryCollection'.lower():
            raise ValueError('Geometry Type must be a GeometryCollection')
        return cls(geometries=[GeometryFactory.from_dict(geometry) for geometry in obj['geometries']])

    def to_dict(self):
        return {
            'type': self.type,
            'geometries': [geometry.to_dict() for geometry in self.geometries]
        }

    def as_geojson(self):
        return self.__geo_interface__()


@dataclasses.dataclass
class AffectedCells:
    # 3D array of booleans
    shape: tuple[int, int, int]
    data: list[list[list[bool]]]

    @classmethod
    def empty_from_shape(cls, nx: int, ny: int, nz: int = 1):
        return cls(
            shape=(nz, ny, nx),
            data=np.zeros((nz, ny, nx), dtype=bool).tolist()
        )

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
    def from_dict(cls, obj: dict | None):
        if obj is None:
            return None
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

    def to_bool(self):
        return np.array(self.data, dtype=bool).tolist()

    def get_cell(self, cell: tuple[int, int, int]) -> bool:
        try:
            return self.data[cell[0]][cell[1]][cell[2]]
        except IndexError:
            raise ValueError('cell is out of bounds')

    def get_cell_value(self, x: int, y: int, z: int = 0):
        try:
            return self.data[z][y][x]
        except IndexError:
            return False

    def set_cell_value(self, value: bool, x: int, y: int, z: int = 0):
        try:
            self.data[z][y][x] = value
        except IndexError:
            raise ValueError(f'cell x:{x}, y:{y}, z:{z} is out of bounds')

    def get_row(self, row: tuple[int, int]) -> list[bool]:
        try:
            return self.data[row[0]][row[1]]
        except IndexError:
            raise ValueError(f'row {row[0]} is out of bounds')

    def get_layer(self, layer: int) -> list[list[bool]]:
        try:
            return self.data[layer]
        except IndexError:
            raise ValueError(f'layer {layer} is out of bounds')


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
    def from_value(cls, value: str):
        return cls.from_str(value)

    @classmethod
    def meters(cls):
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

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass
class Rotation(float):
    value: float

    def __init__(self, value: float):
        if value < 0 or value > 90:
            raise ValueError('Rotation must be between 0 and 90')
        self.value = value

    @classmethod
    def from_float(cls, number: float):
        return cls(number)

    @classmethod
    def from_value(cls, value: float):
        return cls.from_float(value)

    def to_float(self):
        return self.value

    def to_value(self):
        return self.to_float()


@dataclasses.dataclass(frozen=True)
class CRS:
    # everything accepted by pyproj.CRS.from_user_input(), e.g. "EPSG:4326"
    value: str

    @classmethod
    def from_str(cls, crs: str):
        try:
            pyproj.CRS.from_user_input(crs)
            return cls(value=crs)
        except Exception:
            raise ValueError('Invalid CRS')

    @classmethod
    def from_value(cls, crs: str):
        return cls.from_str(crs)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


class CreateGridDict(TypedDict):
    x_coordinates: list[float]
    y_coordinates: list[float]
    rotation: float
    length_unit: Literal["meters", "centimeters", "feet", "unknown"]


@dataclasses.dataclass(frozen=True)
class Grid:
    # Non-uniform Rectilinear 2D Grid
    x_coordinates: list[float]
    y_coordinates: list[float]
    origin: Point
    rotation: Rotation
    length_unit: LengthUnit
    crs = CRS.from_str('EPSG:4326')

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            x_coordinates=obj['x_coordinates'],
            y_coordinates=obj['y_coordinates'],
            origin=Point.from_dict(obj['origin']),
            rotation=Rotation.from_value(obj['rotation']),
            length_unit=LengthUnit.from_value(obj['length_unit']),
        )

    def to_dict(self):
        return {
            'x_coordinates': self.x_coordinates,
            'y_coordinates': self.y_coordinates,
            'origin': self.origin.to_dict(),
            'rotation': self.rotation.to_value(),
            'length_unit': self.length_unit.to_value(),
        }

    def nx(self):
        return len(self.x_coordinates) - 1

    def ny(self):
        return len(self.y_coordinates) - 1


@dataclasses.dataclass(frozen=True)
class SpatialDiscretization:
    geometry: Polygon
    grid: Grid
    affected_cells: AffectedCells | None
    crs: CRS = CRS.from_str('EPSG:4326')

    @classmethod
    def new(cls):
        return cls(
            geometry=Polygon(coordinates=[[(0, 0), (1, 0), (1, 1), (0, 1), (0, 0)]]),
            affected_cells=AffectedCells(shape=(1, 1, 1), data=[[[True]]]),
            grid=Grid(
                x_coordinates=[0, 1],
                y_coordinates=[0, 1],
                origin=Point(coordinates=(0, 0)),
                rotation=Rotation.from_float(0.0),
                length_unit=LengthUnit.meters()
            ),
            crs=CRS.from_str('EPSG:4326')
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            geometry=Polygon.from_dict(obj['geometry']),
            affected_cells=AffectedCells.from_dict(obj['affected_cells'] if obj.get('affected_cells') else None),
            grid=Grid.from_dict(obj['grid']),
            crs=CRS.from_value(obj['crs'] if obj.get('crs') else 'EPSG:4326')
        )

    def to_dict(self):
        return {
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict() if self.affected_cells else None,
            'grid': self.grid.to_dict(),
            'crs': self.crs.to_value()
        }

    def with_geometry(self, geometry: Polygon):
        return dataclasses.replace(self, geometry=geometry)

    def with_grid(self, grid: Grid):
        return dataclasses.replace(self, grid=grid)

    def with_affected_cells(self, affected_cells: AffectedCells):
        return dataclasses.replace(self, affected_cells=affected_cells)

    def with_crs(self, crs: CRS):
        return dataclasses.replace(self, crs=crs)
