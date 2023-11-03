import dataclasses
import numpy as np
from shapely import affinity, Polygon as ShapelyPolygon, Point as ShapelyPoint
from typing import Literal, TypedDict

import pyproj


@dataclasses.dataclass
class Point:
    coordinates: tuple[float, float]
    type: Literal['Point'] = 'Point'

    def __init__(self, coordinates: tuple[float, float]):
        self.coordinates = coordinates
        self.type = 'Point'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'Point'.lower():
            raise ValueError('Geometry Type must be a Point')
        return cls(
            coordinates=obj['coordinates']
        )

    def to_dict(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }


@dataclasses.dataclass
class Polygon:
    coordinates: list[list[tuple[float, float]]]
    type: Literal['Polygon'] = 'Polygon'

    def __init__(self, coordinates: list[list[tuple[float, float]]]):
        self.coordinates = coordinates
        self.type = 'Polygon'

    def __geo_interface__(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }

    @classmethod
    def from_dict(cls, obj: dict):
        if str(obj['type']).lower() != 'Polygon'.lower():
            raise ValueError('Geometry Type must be a Polygon')
        return cls(
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

    def get_cell(self, cell: tuple[int, int, int]) -> bool:
        try:
            return self.data[cell[0]][cell[1]][cell[2]]
        except IndexError:
            raise ValueError('cell is out of bounds')

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

    def get_layer(self, layer: tuple[int, int]) -> list[list[bool]]:
        try:
            return self.data[layer[0]]
        except IndexError:
            raise ValueError(f'layer {layer[0]} is out of bounds')


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


@dataclasses.dataclass
class Rotation(float):
    value: float

    def __init__(self, value: float):
        if value < 0 or value > 90:
            raise ValueError('Rotation must be between 0 and 90')
        self.value = value

    @classmethod
    def from_float(cls, number: float):
        return cls(value=number)

    def to_float(self):
        return self.value


@dataclasses.dataclass(frozen=True)
class CRS:
    # everything accepted by pyproj.CRS.from_user_input(), e.g. "EPSG:4326"
    value: str

    @classmethod
    def from_str(cls, crs: str):
        try:
            pyproj.CRS.from_user_input(crs)
            return cls(value=crs)
        except pyproj.exceptions.CRSError:
            raise ValueError('Invalid CRS')

    def to_str(self):
        return self.value


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
    def from_polygon(cls, area: Polygon, rotation: Rotation, length_unit: LengthUnit,
                     x_coordinates: list[float], y_coordinates: list[float]):
        if len(x_coordinates) < 1 or len(y_coordinates) < 1:
            raise ValueError('percentages must have at least one element')
        if x_coordinates[0] != 0 or y_coordinates[0] != 0:
            raise ValueError('percentages must start with 0')
        if x_coordinates[-1] != 1 or y_coordinates[-1] != 1:
            raise ValueError('percentages must end with 1')
        if any([percentage < 0 or percentage > 1 for percentage in x_coordinates + y_coordinates]):
            raise ValueError('percentages must be between 0 and 1')

        polygon = ShapelyPolygon(area.coordinates[0])
        from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
        from_3867_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)

        # transform polygon to 3857
        polygon_3857 = ShapelyPolygon([from_4326_to_3857.transform(x, y) for x, y in polygon.exterior.coords])

        # rotate polygon to 0 degrees
        polygon_3857_0_degrees = affinity.rotate(polygon_3857, -rotation.to_float(), origin=polygon_3857.centroid)

        # get_bounding_box polygon
        bounding_box_polygon_3857_0_degrees = ShapelyPolygon(polygon_3857_0_degrees).envelope

        if not isinstance(bounding_box_polygon_3857_0_degrees, ShapelyPolygon):
            raise ValueError('Grid bounding box is not a polygon')

        min_x, min_y, max_x, max_y = bounding_box_polygon_3857_0_degrees.bounds

        x_coordinates = [percentage * (max_x - min_x) for percentage in x_coordinates]
        y_coordinates = [percentage * (max_y - min_y) for percentage in y_coordinates]
        origen_3857_0_degrees = ShapelyPoint((min_x, min_y))

        origen_3857 = affinity.rotate(geom=origen_3857_0_degrees,
                                      angle=rotation.to_float(),
                                      origin=polygon_3857.centroid)

        origen_4326 = from_3867_to_4326.transform(origen_3857.x, origen_3857.y)

        return cls(
            x_coordinates=x_coordinates,
            y_coordinates=y_coordinates,
            origin=Point(coordinates=origen_4326),
            rotation=rotation,
            length_unit=length_unit
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            x_coordinates=obj['x_coordinates'],
            y_coordinates=obj['y_coordinates'],
            origin=Point.from_dict(obj['origin']),
            rotation=Rotation.from_float(obj['rotation']),
            length_unit=LengthUnit.from_str(obj['length_unit']),
        )

    def to_dict(self):
        return {
            'x_coordinates': self.x_coordinates,
            'y_coordinates': self.y_coordinates,
            'origin': self.origin.to_dict(),
            'rotation': self.rotation.to_float(),
            'length_unit': self.length_unit.to_str(),
        }

    def nx(self):
        return len(self.x_coordinates) - 1

    def ny(self):
        return len(self.y_coordinates) - 1

    def get_cell_centers(self) -> list[list[Point]]:
        centers = np.empty((self.ny(), self.nx()), dtype=Point)
        from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
        origin_3857 = from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)
        for y in range(self.ny()):
            for x in range(self.nx()):
                point_3857 = ShapelyPoint((
                    origin_3857[0] + (self.x_coordinates[x] + self.x_coordinates[x + 1]) / 2,
                    origin_3857[1] + (self.y_coordinates[y] + self.y_coordinates[y + 1]) / 2)
                )

                rotated_point_3857 = affinity.rotate(point_3857, self.rotation.to_float(), origin=origin_3857)
                point_4326 = from_3857_to_4326.transform(rotated_point_3857.x, rotated_point_3857.y)
                centers[y][x] = Point(coordinates=point_4326)

        return centers.tolist()

    def get_cell_geometries(self) -> list[list[Polygon]]:
        geometries = np.empty((self.ny(), self.nx()), dtype=Polygon)
        from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
        origin_3857 = from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)

        for y in range(self.ny()):
            for x in range(self.nx()):
                polygon_3857 = ShapelyPolygon((
                    (origin_3857[0] + self.x_coordinates[x], origin_3857[1] + self.y_coordinates[y]),
                    (origin_3857[0] + self.x_coordinates[x + 1], origin_3857[1] + self.y_coordinates[y]),
                    (origin_3857[0] + self.x_coordinates[x + 1], origin_3857[1] + self.y_coordinates[y + 1]),
                    (origin_3857[0] + self.x_coordinates[x], origin_3857[1] + self.y_coordinates[y + 1]),
                    (origin_3857[0] + self.x_coordinates[x], origin_3857[1] + self.y_coordinates[y]),
                ))

                rotated_polygon_3857 = affinity.rotate(polygon_3857, self.rotation.to_float(), origin=origin_3857)
                geometry_4326 = [from_3857_to_4326.transform(point[0], point[1]) for point in
                                 list(rotated_polygon_3857.exterior.coords)]
                geometries[y][x] = Polygon(coordinates=[geometry_4326])
        return geometries.tolist()

    def get_grid_geometry(self) -> Polygon:
        from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
        from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)
        origin_3857 = from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])

        polygon_3857 = ShapelyPolygon((
            origin_3857,
            (origin_3857[0] + self.x_coordinates[-1], origin_3857[1]),
            (origin_3857[0] + self.x_coordinates[-1], origin_3857[1] + self.y_coordinates[-1]),
            (origin_3857[0], origin_3857[1] + self.y_coordinates[-1]),
            origin_3857,
        ))

        rotated_polygon_3857 = affinity.rotate(polygon_3857, self.rotation.to_float(), origin=origin_3857)
        geometry_4326 = [from_3857_to_4326.transform(point[0], point[1]) for point in
                         list(rotated_polygon_3857.exterior.coords)]
        return Polygon(coordinates=[geometry_4326])


@dataclasses.dataclass(frozen=True)
class SpatialDiscretization:
    geometry: Polygon
    grid: Grid
    affected_cells: AffectedCells | None
    crs: CRS = CRS.from_str('EPSG:4326')

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            geometry=Polygon.from_dict(obj['geometry']),
            affected_cells=AffectedCells.from_dict(obj['affected_cells'] if obj.get('affected_cells') else None),
            grid=Grid.from_dict(obj['grid']),
            crs=CRS.from_str(obj['crs'] if obj.get('crs') else 'EPSG:4326')
        )

    def to_dict(self):
        return {
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict() if self.affected_cells else None,
            'grid': self.grid.to_dict(),
            'crs': self.crs.to_str()
        }

    def set_affected_cells(self, affected_cells: AffectedCells):
        return dataclasses.replace(self, affected_cells=affected_cells)

    def calculate_affected_cells(self):
        nx = self.grid.nx()
        ny = self.grid.ny()
        affected_cells = AffectedCells.empty_from_shape(nx=nx, ny=ny)
        area = ShapelyPolygon(self.geometry.coordinates[0])
        grid_cell_centers = self.grid.get_cell_centers()
        for x in range(nx):
            for y in range(ny):
                center = ShapelyPoint(grid_cell_centers[y][x].coordinates)
                affected_cells.set_cell_value(x=x, y=y, value=area.contains(center))

        return dataclasses.replace(self, affected_cells=affected_cells)
