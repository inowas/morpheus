import dataclasses

import numpy as np
from shapely import LineString as ShapelyLineString, Point as ShapelyPoint, Polygon as ShapelyPolygon, MultiPolygon as ShapelyMultiPolygon
from shapely.ops import unary_union
from morpheus.project.types.discretization.spatial import Grid
from morpheus.project.types.geometry import GeometryCollection, Polygon, Point, LineString
from morpheus.project.types.geometry.Feature import Feature
from morpheus.project.types.geometry.MultiPolygon import MultiPolygon


@dataclasses.dataclass
class ActiveCell:
    col: int
    row: int

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            col=obj['col'],
            row=obj['row'],
        )

    def to_dict(self):
        return {
            'col': self.col,
            'row': self.row,
        }

    @classmethod
    def from_tuple(cls, obj: tuple):
        return cls(
            col=obj[0],
            row=obj[1],
        )

    def to_tuple(self):
        return self.col, self.row


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
    def empty_from_shape(cls, n_cols: int, n_rows: int):
        return cls(
            shape=(n_rows, n_cols),
            data=[]
        )

    @classmethod
    def empty_from_grid(cls, grid: Grid):
        return cls(
            shape=(grid.n_rows(), grid.n_cols()),
            data=[]
        )

    def filter(self, predicate):
        return ActiveCells(
            shape=self.shape,
            data=[cell for cell in self.data if predicate(cell)]
        )

    def contains(self, cell: ActiveCell) -> bool:
        return self.is_active(col=cell.col, row=cell.row)

    @classmethod
    def from_linestring(cls, linestring: LineString, grid: Grid):
        cells = ActiveCells.empty_from_shape(n_cols=grid.n_cols(), n_rows=grid.n_rows())
        geometries = grid.get_cell_geometries()
        linestring = ShapelyLineString(linestring.coordinates)

        for col in range(grid.n_cols()):
            for row in range(grid.n_rows()):
                grid_cell_geometry = ShapelyPolygon(geometries[row][col].coordinates[0])
                if grid_cell_geometry.intersects(linestring):
                    cells.set_active(col=col, row=row)

        return cells

    @classmethod
    def from_polygon(cls, polygon: Polygon, grid: Grid):
        cells = cls.empty_from_shape(n_cols=grid.n_cols(), n_rows=grid.n_rows())
        area = ShapelyPolygon(polygon.coordinates[0])
        grid_cell_centers = grid.get_cell_centers()
        for col in range(grid.n_cols()):
            for row in range(grid.n_rows()):
                center = ShapelyPoint(grid_cell_centers[row][col].coordinates)
                if area.contains(center):
                    cells.set_active(col=col, row=row)

        return cells

    @classmethod
    def from_point(cls, point: Point, grid: Grid):
        cells = ActiveCells.empty_from_shape(n_cols=grid.n_cols(), n_rows=grid.n_rows())
        point = ShapelyPoint(point.coordinates)
        grid_cell_geometries = grid.get_cell_geometries()
        for col in range(grid.n_cols()):
            for row in range(grid.n_rows()):
                grid_cell_geometry = ShapelyPolygon(grid_cell_geometries[row][col].coordinates[0])
                if grid_cell_geometry.contains(point):
                    cells.set_active(col=col, row=row)

        return cells

    @classmethod
    def from_dict(cls, obj: dict):

        available_dict_types = ['raster', 'sparse', 'sparse_inverse']
        if obj['type'] not in available_dict_types:
            raise ValueError(f'Unknown grid cells dict_type: {obj["type"]}')

        if obj['type'] == 'raster':
            raster_data = np.array(obj['data'], dtype=bool)
            if raster_data.shape != tuple(obj['shape']):
                raise ValueError(f'Grid cells shape {obj["shape"]} does not match raster data shape {raster_data.shape}')

            empty_value = obj['empty_value'] if 'empty_value' in obj else False
            grid_cells = []
            for row in range(obj['shape'][0]):
                for col in range(obj['shape'][1]):
                    value = raster_data[row, col]
                    if value and value != empty_value:
                        grid_cells.append(ActiveCell(col=col, row=row))

            return cls(
                shape=obj['shape'],
                data=grid_cells
            )

        if obj['type'] == 'sparse':
            return cls(
                shape=obj['shape'],
                data=[ActiveCell.from_tuple(cell) for cell in obj['data']]
            )

        if obj['type'] == 'sparse_inverse':
            raster_data = np.full(shape=obj['shape'], fill_value=True, dtype=bool)
            for cell in obj['data']:
                raster_data[cell[1], cell[0]] = False

            grid_cells = []
            for row in range(obj['shape'][0]):
                for col in range(obj['shape'][1]):
                    if raster_data[row, col]:
                        grid_cells.append(ActiveCell(col=col, row=row))

            return cls(
                shape=obj['shape'],
                data=grid_cells
            )

        raise ValueError(f'Unknown grid cells type: {obj["type"]}')

    def to_dict(self, as_raster: bool | None = None, auto_detect: bool = True):

        available_dict_types = ['raster', 'sparse', 'sparse_inverse']
        dict_type: str = 'raster' if as_raster else 'sparse'
        if auto_detect:
            if len(self.data) <= (self.shape[0] * self.shape[1] * 0.10):
                dict_type = 'sparse'
            elif len(self.data) >= (self.shape[0] * self.shape[1] * 0.90):
                dict_type = 'sparse_inverse'
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

        if dict_type == 'sparse_inverse':
            inverted_value = False
            raster = np.full(shape=self.shape, fill_value=inverted_value, dtype=bool)
            for cell in self.data:
                raster[cell.row, cell.col] = True

            inverted_raster = np.invert(raster)
            data = []
            for row in range(self.shape[0]):
                for col in range(self.shape[1]):
                    if inverted_raster[row, col]:
                        data.append(ActiveCell(col=col, row=row))

            return {
                'type': dict_type,
                'shape': self.shape,
                'data': [cell.to_tuple() for cell in data]
            }

        # save as Raster data
        empty_value = False
        data = np.full(shape=self.shape, fill_value=empty_value, dtype=bool)
        for cell in self.data:
            data[cell.row, cell.col] = True

        return {
            'type': dict_type,
            'empty_value': empty_value,
            'shape': self.shape,
            'data': data.tolist()
        }

    def is_active(self, col: int, row: int) -> bool:
        if row < 0 or row >= self.shape[0] or col < 0 or col >= self.shape[1]:
            return False

        try:
            return next(cell for cell in self.data if cell.col == col and cell.row == row) is not None
        except StopIteration:
            return False

    def set_inactive(self, col: int, row: int):
        self.data = [cell for cell in self.data if cell.col != col or cell.row != row]

    def set_active(self, col: int, row: int):
        if row < 0 or row >= self.shape[0] or col < 0 or col >= self.shape[1]:
            return

        if self.is_active(col=col, row=row):
            return

        self.data.append(ActiveCell(col=col, row=row))

    def to_geojson(self, grid: Grid) -> GeometryCollection:
        cells_geometries = grid.get_cell_geometries()
        cell_geometries = []
        for col in range(grid.n_cols()):
            for row in range(grid.n_rows()):
                if self.is_active(col=col, row=row):
                    cell_geometries.append(cells_geometries[row][col])

        return GeometryCollection(geometries=cell_geometries)

    def to_mask(self) -> np.ndarray:
        raster_data = np.full(shape=self.shape, fill_value=False, dtype=bool)
        for cell in self.data:
            raster_data[cell.row, cell.col] = True
        return raster_data

    def outline_to_geojson(self, grid: Grid) -> Feature:
        geometries = self.to_geojson(grid).geometries
        geometries = [ShapelyPolygon(geometry.coordinates[0]) for geometry in geometries]
        geometry = unary_union(geometries)
        if isinstance(geometry, ShapelyPolygon):
            geometry_dict = geometry.__geo_interface__
            feature = Feature(geometry=Polygon(coordinates=geometry_dict['coordinates']))
            return feature

        if isinstance(geometry, ShapelyMultiPolygon):
            geometry_dict = geometry.__geo_interface__
            feature = Feature(geometry=MultiPolygon(coordinates=geometry_dict['coordinates']))
            return feature

        raise Exception(f'Merged cells geometry is not a polygon nor multipolygon: {geometry}')
