import dataclasses

import numpy as np
from shapely import LineString as ShapelyLineString, Point as ShapelyPoint, Polygon as ShapelyPolygon
from shapely.ops import unary_union
from morpheus.modflow.types.discretization.spatial import Grid
from morpheus.modflow.types.geometry import GeometryCollection, Polygon, Point, LineString


@dataclasses.dataclass
class ActiveCell:
    x: int
    y: int

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            x=obj['x'],
            y=obj['y'],
        )

    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
        }

    @classmethod
    def from_tuple(cls, obj: tuple):
        return cls(
            x=obj[0],
            y=obj[1],
        )

    def to_tuple(self):
        return self.x, self.y


@dataclasses.dataclass
class ActiveCells:
    shape: tuple[int, int]
    data: list[ActiveCell]

    def __len__(self):
        return len(self.data)

    def __iter__(self):
        return iter(self.data)

    def __eq__(self, other):
        if not isinstance(other, ActiveCells):
            return False
        return self.to_dict(as_raster=True) == other.to_dict(as_raster=True)

    @classmethod
    def empty_from_shape(cls, nx: int, ny: int):
        return cls(
            shape=(ny, nx),
            data=[]
        )

    @classmethod
    def empty_from_grid(cls, grid: Grid):
        return cls(
            shape=(grid.ny(), grid.nx()),
            data=[]
        )

    def filter(self, predicate):
        return ActiveCells(
            shape=self.shape,
            data=[cell for cell in self.data if predicate(cell)]
        )

    def contains(self, cell: ActiveCell) -> bool:
        return self.is_active(x=cell.x, y=cell.y) is not None

    @classmethod
    def from_linestring(cls, linestring: LineString, grid: Grid):
        cells = ActiveCells.empty_from_shape(nx=grid.nx(), ny=grid.ny())
        geometries = grid.get_cell_geometries()
        linestring = ShapelyLineString(linestring.coordinates)

        for x in range(grid.nx()):
            for y in range(grid.ny()):
                grid_cell_geometry = ShapelyPolygon(geometries[x][y].coordinates[0])
                if grid_cell_geometry.intersects(linestring):
                    cells.set_active(x=x, y=y)

        return cells

    @classmethod
    def from_polygon(cls, polygon: Polygon, grid: Grid):
        cells = cls.empty_from_shape(nx=grid.nx(), ny=grid.ny())
        area = ShapelyPolygon(polygon.coordinates[0])
        grid_cell_centers = grid.get_cell_centers()
        for x in range(grid.nx()):
            for y in range(grid.ny()):
                center = ShapelyPoint(grid_cell_centers[x][y].coordinates)
                if area.contains(center):
                    cells.set_active(x=x, y=y)

        return cells

    @classmethod
    def from_point(cls, point: Point, grid: Grid):
        cells = ActiveCells.empty_from_shape(nx=grid.nx(), ny=grid.ny())
        point = ShapelyPoint(point.coordinates)
        grid_cell_geometries = grid.get_cell_geometries()
        for x in range(grid.nx()):
            for y in range(grid.ny()):
                grid_cell_geometry = ShapelyPolygon(grid_cell_geometries[x][y].coordinates[0])
                if grid_cell_geometry.contains(point):
                    cells.set_active(x=x, y=y)

        return cells

    @classmethod
    def from_dict(cls, obj: dict):

        available_dict_types = ['raster', 'sparse', 'sparse_inverted']
        if obj['type'] not in available_dict_types:
            raise ValueError(f'Unknown grid cells dict_type: {obj["type"]}')

        if obj['type'] == 'raster':
            raster_data = np.array(obj['data'], dtype=bool)
            if raster_data.shape != tuple(obj['shape']):
                raise ValueError(f'Grid cells shape {obj["shape"]} does not match raster data shape {raster_data.shape}')

            empty_value = obj['empty_value']
            grid_cells = []
            for y in range(obj['shape'][0]):
                for x in range(obj['shape'][1]):
                    value = raster_data[y, x]
                    if value and value != empty_value:
                        grid_cells.append(ActiveCell(x=x, y=y))

            return cls(
                shape=obj['shape'],
                data=grid_cells
            )

        if obj['type'] == 'sparse':
            return cls(
                shape=obj['shape'],
                data=[ActiveCell.from_tuple(cell) for cell in obj['data']]
            )

        if obj['type'] == 'sparse_inverted':
            raster_data = np.full(shape=obj['shape'], fill_value=True, dtype=bool)
            for cell in obj['data']:
                raster_data[cell[1], cell[0]] = False

            grid_cells = []
            for y in range(obj['shape'][0]):
                for x in range(obj['shape'][1]):
                    if raster_data[y, x]:
                        grid_cells.append(ActiveCell(x=x, y=y))

            return cls(
                shape=obj['shape'],
                data=grid_cells
            )

        raise ValueError(f'Unknown grid cells type: {obj["type"]}')

    def to_dict(self, as_raster: bool | None = None, auto_detect: bool = True):

        available_dict_types = ['raster', 'sparse', 'sparse_inverted']
        dict_type: str = 'raster' if as_raster else 'sparse'
        if auto_detect:
            if len(self.data) <= (self.shape[0] * self.shape[1] * 0.10):
                dict_type = 'sparse'
            elif len(self.data) >= (self.shape[0] * self.shape[1] * 0.90):
                dict_type = 'sparse_inverted'
            else:
                dict_type = 'raster'

        if as_raster is True:
            dict_type = 'raster'

        if dict_type not in available_dict_types:
            raise ValueError(f'Unknown grid cells dict_type: {dict_type}')

        if dict_type == 'sparse':
            return {
                'type': dict_type,
                'shape': self.shape,
                'data': [cell.to_tuple() for cell in self.data]
            }

        if dict_type == 'sparse_inverted':
            inverted_value = False
            raster = np.full(shape=self.shape, fill_value=inverted_value, dtype=bool)
            for cell in self.data:
                raster[cell.y, cell.x] = True

            inverted_raster = np.invert(raster)
            data = []
            for y in range(self.shape[0]):
                for x in range(self.shape[1]):
                    if inverted_raster[y, x]:
                        data.append(ActiveCell(x=x, y=y))

            return {
                'type': dict_type,
                'shape': self.shape,
                'data': [cell.to_tuple() for cell in data]
            }

        # save as Raster data
        empty_value = False
        data = np.full(shape=self.shape, fill_value=empty_value, dtype=bool)
        for cell in self.data:
            data[cell.y, cell.x] = True

        return {
            'type': dict_type,
            'empty_value': empty_value,
            'shape': self.shape,
            'data': data.tolist()
        }

    def is_active(self, x: int, y: int) -> bool:
        if y < 0 or y >= self.shape[0] or x < 0 or x >= self.shape[1]:
            return False

        try:
            return next(cell for cell in self.data if cell.x == x and cell.y == y) is not None
        except StopIteration:
            return False

    def set_inactive(self, x: int, y: int):
        self.data = [cell for cell in self.data if cell.x != x or cell.y != y]

    def set_active(self, x: int, y: int):
        if y < 0 or y >= self.shape[0] or x < 0 or x >= self.shape[1]:
            return

        if self.is_active(x=x, y=y):
            return

        self.data.append(ActiveCell(x=x, y=y))

    def as_geojson(self, grid: Grid):
        cells_geometries = grid.get_cell_geometries()
        cell_geometries = []
        for x in range(grid.nx()):
            for y in range(grid.ny()):
                if self.is_active(x=x, y=y):
                    cell_geometries.append(cells_geometries[x][y])

        return GeometryCollection(geometries=cell_geometries)

    def as_geojson_outline(self, grid: Grid) -> Polygon:
        geometries = self.as_geojson(grid).geometries
        geometries = [ShapelyPolygon(geometry.coordinates[0]) for geometry in geometries]
        geometry = unary_union(geometries)
        if isinstance(geometry, ShapelyPolygon):
            geometry_dict = geometry.__geo_interface__
            return Polygon(coordinates=geometry_dict['coordinates'])

        raise Exception(f'Merged cells geometry is not a polygon, but a {type(geometry)}')
