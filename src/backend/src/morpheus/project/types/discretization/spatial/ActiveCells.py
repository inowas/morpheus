import dataclasses

import numpy as np
from shapely import LineString as ShapelyLineString, Polygon as ShapelyPolygon, MultiPolygon as ShapelyMultiPolygon, MultiLineString as ShapelyMultiLineString
from shapely.ops import unary_union
from shapely.lib import intersection as shapely_intersection
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
            col=obj[1],
            row=obj[0],
        )

    def to_tuple(self):
        return self.row, self.col


@dataclasses.dataclass
class ActiveCells:
    shape: tuple[int, int]
    data: list[ActiveCell]

    _data_arr: None | np.ndarray = None

    def get_data_arr(self):
        if self._data_arr is None:
            self._data_arr = np.full(shape=self.shape, fill_value=False, dtype=bool)
            for cell in self.data:
                self._data_arr[cell.row, cell.col] = True
        return self._data_arr

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

    @classmethod
    def from_numpy(cls, data: np.ndarray):
        rows, cols = data.shape
        active_cells = []
        for row in range(rows):
            for col in range(cols):
                if data[row, col]:
                    active_cells.append(ActiveCell(col=col, row=row))
        return cls(
            shape=(rows, cols),
            data=active_cells
        )

    def mask(self, mask: np.ndarray):
        if mask.shape != self.shape:
            raise ValueError(f'Mask shape {mask.shape} does not match active cells shape {self.shape}')

        data_arr = self.get_data_arr()
        data = np.logical_and(data_arr, mask)
        return ActiveCells.from_numpy(data)

    def filter(self, predicate):
        return ActiveCells(
            shape=self.shape,
            data=[cell for cell in self.data if predicate(cell)]
        )

    def merge(self, other):
        if not isinstance(other, ActiveCells):
            raise ValueError(f'Cannot merge with object of type {type(other)}')

        data = np.full(shape=self.shape, fill_value=False, dtype=bool)
        data.fill(False)
        for cell in self.data:
            data[cell.row, cell.col] = True

        for cell in other:
            data[cell.row, cell.col] = True

        return ActiveCells.from_numpy(data)

    def contains(self, cell: ActiveCell) -> bool:
        return self.is_active(col=cell.col, row=cell.row)

    @classmethod
    def from_geometry(cls, geometry: LineString | MultiPolygon | Point | Polygon, grid: Grid):
        if isinstance(geometry, LineString):
            return cls.from_linestring(linestring=geometry, grid=grid)

        if isinstance(geometry, MultiPolygon):
            return cls.from_multipolygon(multipolygon=geometry, grid=grid)

        if isinstance(geometry, Point):
            return cls.from_point(point=geometry, grid=grid)

        if isinstance(geometry, Polygon):
            return cls.from_polygon(polygon=geometry, grid=grid)

        raise ValueError(f'Unknown geometry type: {geometry}')

    @classmethod
    def from_point(cls, point: Point, grid: Grid):
        affected_cells = ActiveCells.empty_from_shape(n_cols=grid.n_cols(), n_rows=grid.n_rows())
        for cell in grid.get_cells_from_wgs_point(point=point):
            col, row = cell
            affected_cells.set_active(col=col, row=row)

        return affected_cells

    @classmethod
    def from_linestring(cls, linestring: LineString | ShapelyLineString, grid: Grid):
        # prepare input
        shapely_linestring: ShapelyLineString = linestring
        if not isinstance(linestring, ShapelyLineString):
            shapely_linestring: ShapelyLineString = ShapelyLineString(linestring.coordinates)

        # prepare output
        cells = np.empty(shape=(grid.n_rows(), grid.n_cols()), dtype=bool)
        cells.fill(False)

        # intersect input with grid-outline
        grid_outline = ShapelyPolygon(grid.get_wgs_outline_geometry().geometry.coordinates[0])
        shapely_linestring: ShapelyLineString = grid_outline.intersection(shapely_linestring)
        if shapely_linestring.is_empty:
            return cls.empty_from_shape(n_cols=grid.n_cols(), n_rows=grid.n_rows())

        # get grid center lines
        row_center_lines: list[ShapelyLineString] = [ShapelyLineString(row.coordinates) for row in grid.get_wgs_row_center_lines()]
        column_center_lines: list[ShapelyLineString] = [ShapelyLineString(col.coordinates) for col in grid.get_wgs_column_center_lines()]

        # calculate intersections with grid center lines and add them to the known points variable
        # known points are also all the points of the linestring
        known_points = [Point(coordinates=coord) for coord in shapely_linestring.coords]
        for row_center_line in row_center_lines:
            point = row_center_line.intersection(shapely_linestring)
            if not point.is_empty and point.geom_type == 'Point':
                known_points.append(Point(coordinates=point.coords[0]))

        for col_center_line in column_center_lines:
            point = col_center_line.intersection(shapely_linestring)
            if not point.is_empty and point.geom_type == 'Point':
                known_points.append(Point(coordinates=point.coords[0]))

        for point in known_points:
            active_cells = grid.get_cells_from_wgs_point(point=point)
            for cell in active_cells:
                col, row = cell
                cells[row, col] = True

        return cls.from_numpy(cells)

    @classmethod
    def from_polygon(cls, polygon: Polygon | ShapelyPolygon, grid: Grid):
        # prepare input
        shapely_polygon: ShapelyPolygon = polygon
        if not isinstance(polygon, ShapelyPolygon):
            shapely_polygon = ShapelyPolygon(polygon.coordinates[0])

        # prepare output
        cells = np.empty(shape=(grid.n_rows(), grid.n_cols()), dtype=bool)
        cells.fill(False)

        # intersect input with grid-outline
        grid_outline = ShapelyPolygon(grid.get_wgs_outline_geometry().geometry.coordinates[0])
        shapely_polygon: ShapelyPolygon = grid_outline.intersection(shapely_polygon)
        if shapely_polygon.is_empty:
            return cls.empty_from_shape(n_cols=grid.n_cols(), n_rows=grid.n_rows())

        # get row center lines
        row_center_lines: ShapelyMultiLineString = ShapelyMultiLineString([ShapelyLineString(row.coordinates) for row in grid.get_wgs_row_center_lines()])

        # calculate the intersections with the grid center lines
        # intersections is a mult line string with the intersection lines
        intersections = shapely_intersection(shapely_polygon, row_center_lines)
        for idx, intersection in enumerate(intersections.geoms):
            if intersection.is_empty:
                continue
            if intersection.geom_type == 'LineString':
                active_cells_start = grid.get_cells_from_wgs_point(Point(coordinates=intersection.coords[0]))
                active_cells_end = grid.get_cells_from_wgs_point(Point(coordinates=intersection.coords[-1]))

                if len(active_cells_start) == 0 or len(active_cells_end) == 0:
                    continue

                col_start, row_start = active_cells_start[0]
                col_end, row_end = active_cells_end[0]

                if row_start != row_end:
                    raise ValueError(f'Row start {row_start} and row end {row_end} do not match')

                for col in range(col_start, col_end + 1):
                    cells[row_start, col] = True

            if intersection.geom_type == 'MultiLineString':
                for line in intersection.geoms:
                    active_cells_start = grid.get_cells_from_wgs_point(Point(coordinates=line.coords[0]))
                    active_cells_end = grid.get_cells_from_wgs_point(Point(coordinates=line.coords[-1]))
                    if len(active_cells_start) == 0 or len(active_cells_end) == 0:
                        continue

                    col_start, row_start = active_cells_start[0]
                    col_end, row_end = active_cells_end[0]

                    if row_start != row_end:
                        raise ValueError(f'Row start {row_start} and row end {row_end} do not match')

                    for col in range(col_start, col_end + 1):
                        cells[row_start, col] = True

        return cls.from_numpy(cells)

    @classmethod
    def from_multipolygon(cls, multipolygon: MultiPolygon, grid: Grid):
        polygons = [Polygon(coordinates=coordinate) for coordinate in multipolygon.coordinates]
        active_cells = cls.empty_from_grid(grid)
        for polygon in polygons:
            active_cells.merge(cls.from_polygon(polygon=polygon, grid=grid))

        return active_cells

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
                row, col = cell
                raster_data[row, col] = False

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

    def n_cols(self) -> int:
        return self.shape[1]

    def n_rows(self) -> int:
        return self.shape[0]

    def is_active(self, col: int, row: int) -> bool:
        data_arr = self.get_data_arr()
        return data_arr[row, col] if 0 <= row < self.shape[0] and 0 <= col < self.shape[1] else False

    def set_inactive(self, col: int, row: int):
        self.data = [cell for cell in self.data if cell.col != col or cell.row != row]

    def set_active(self, col: int, row: int):
        if row < 0 or row >= self.shape[0] or col < 0 or col >= self.shape[1]:
            return

        if self.is_active(col=col, row=row):
            return

        self.data.append(ActiveCell(col=col, row=row))
        self._data_arr = None

    def to_geojson(self, grid: Grid) -> GeometryCollection:
        cells_geometries = grid.get_wgs_cell_geometries()
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
        geometries: list[Polygon] = []
        for row in range(grid.n_rows()):
            start_active_cell = None
            end_active_cell = None
            for col in range(grid.n_cols()):
                if self.is_active(col=col, row=row):
                    if start_active_cell is None:
                        start_active_cell = col
                    end_active_cell = col
                if not self.is_active(col=col, row=row):
                    if start_active_cell is not None:
                        geometries.append(grid.get_wgs_row_polygon(row=row, start_col=start_active_cell, end_col=end_active_cell))
                    start_active_cell = None
                    end_active_cell = None
                if col == grid.n_cols() - 1 and start_active_cell is not None:
                    geometries.append(grid.get_wgs_row_polygon(row=row, start_col=start_active_cell, end_col=end_active_cell))

        polygons: list[ShapelyPolygon] = [ShapelyPolygon(polygon.coordinates[0]) for polygon in geometries]
        buffered_polygons = [polygon.buffer(0.000001) for polygon in polygons]
        buffered_geometry = unary_union(buffered_polygons)
        geometry = buffered_geometry.buffer(-0.000001)
        if isinstance(geometry, ShapelyPolygon):
            geometry_dict = geometry.__geo_interface__
            feature = Feature(geometry=Polygon(coordinates=geometry_dict['coordinates']))
            return feature

        if isinstance(geometry, ShapelyMultiPolygon):
            geometry_dict = geometry.__geo_interface__
            feature = Feature(geometry=MultiPolygon(coordinates=geometry_dict['coordinates']))
            return feature

        raise Exception(f'Merged cells geometry is not a polygon nor multipolygon: {geometry}')
