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
    data: np.ndarray

    def __len__(self):
        return self.data[self.data == True].size  # noqa

    def __iter__(self):
        for row in range(self.shape[0]):
            for col in range(self.shape[1]):
                if self.data[row, col]:
                    yield ActiveCell(col=col, row=row)

    def __eq__(self, other):
        if not isinstance(other, ActiveCells):
            return False
        return self.to_dict(as_raster=True) == other.to_dict(as_raster=True)

    @classmethod
    def empty_from_shape(cls, n_cols: int, n_rows: int):
        return cls(
            shape=(n_rows, n_cols),
            data=np.full(shape=(n_rows, n_cols), fill_value=False, dtype=bool)
        )

    @classmethod
    def empty_from_grid(cls, grid: Grid):
        return cls(
            shape=(grid.n_rows(), grid.n_cols()),
            data=np.full(shape=(grid.n_rows(), grid.n_cols()), fill_value=False, dtype=bool)
        )

    @classmethod
    def from_numpy(cls, data: np.ndarray):
        rows, cols = data.shape
        return cls(
            shape=(rows, cols),
            data=data
        )

    def mask(self, other):
        if not isinstance(other, ActiveCells):
            raise ValueError(f'Cannot mask with object of type {type(other)}')
        if self.shape != other.shape:
            raise ValueError(f'Mask shape {other.shape} does not match active cells shape {self.shape}')

        data = np.logical_and(self.data, other.data)
        return ActiveCells.from_numpy(data)

    def merge(self, other):
        if not isinstance(other, ActiveCells):
            raise ValueError(f'Cannot merge with object of type {type(other)}')
        if other.shape != self.shape:
            raise ValueError(f'Merge shape {other.shape} does not match active cells shape {self.shape}')

        data = np.logical_or(self.data, other.data)
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
    def from_linestring(cls, linestring: LineString, grid: Grid):
        # prepare input
        shapely_linestring: ShapelyLineString = linestring.to_shapely_linestring()

        # prepare output
        cells = np.empty(shape=(grid.n_rows(), grid.n_cols()), dtype=bool)
        cells.fill(False)

        # intersect input with grid-outline
        grid_outline: ShapelyPolygon = grid.get_wgs_outline_polygon().to_shapely_polygon()
        intersection = grid_outline.intersection(shapely_linestring)

        if not isinstance(intersection, ShapelyLineString) or shapely_linestring.is_empty:
            return cls.empty_from_shape(n_cols=grid.n_cols(), n_rows=grid.n_rows())

        shapely_linestring = intersection

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
    def from_polygon(cls, polygon: Polygon, grid: Grid):
        # prepare input
        shapely_polygon: ShapelyPolygon = polygon.to_shapely_polygon()

        # prepare output
        cells = np.full(shape=(grid.n_rows(), grid.n_cols()), fill_value=False, dtype=bool)

        # intersect input with grid-outline
        grid_outline: ShapelyPolygon = grid.get_wgs_outline_polygon().to_shapely_polygon()
        intersection = grid_outline.intersection(shapely_polygon)

        if not isinstance(intersection, ShapelyPolygon) or shapely_polygon.is_empty:
            return cls.empty_from_shape(n_cols=grid.n_cols(), n_rows=grid.n_rows())

        shapely_polygon = intersection

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
            active_cells = active_cells.merge(cls.from_polygon(polygon=polygon, grid=grid))

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
            data = np.full(shape=obj['shape'], fill_value=empty_value, dtype=bool)
            for row in range(obj['shape'][0]):
                for col in range(obj['shape'][1]):
                    value = raster_data[row, col]
                    if value and value != empty_value:
                        data[row, col] = True

            return cls(
                shape=(obj['shape'][0], obj['shape'][1]),
                data=data
            )

        if obj['type'] == 'sparse':
            data = np.full(shape=obj['shape'], fill_value=False, dtype=bool)
            for cell in obj['data']:
                row, col = cell
                data[row, col] = True

            return cls(
                shape=(obj['shape'][0], obj['shape'][1]),
                data=data
            )

        if obj['type'] == 'sparse_inverse':
            data = np.full(shape=obj['shape'], fill_value=True, dtype=bool)
            for cell in obj['data']:
                row, col = cell
                data[row, col] = False

            return cls(
                shape=(obj['shape'][0], obj['shape'][1]),
                data=data
            )

        raise ValueError(f'Unknown grid cells type: {obj["type"]}')

    def to_dict(self, as_raster: bool | None = None, auto_detect: bool = True):

        available_dict_types = ['raster', 'sparse', 'sparse_inverse']
        dict_type: str = 'raster' if as_raster else 'sparse'
        if auto_detect:
            number_of_trues = len(self.data[self.data == True])  # noqa
            if number_of_trues <= (self.shape[0] * self.shape[1] * 0.10):
                dict_type = 'sparse'
            elif number_of_trues >= (self.shape[0] * self.shape[1] * 0.90):
                dict_type = 'sparse_inverse'
            else:
                dict_type = 'raster'

        if as_raster is True:
            dict_type = 'raster'

        if dict_type not in available_dict_types:
            raise ValueError(f'Unknown grid cells dict_type: {dict_type}')

        if dict_type == 'sparse':
            cells = []
            for row in range(self.shape[0]):
                for col in range(self.shape[1]):
                    if self.is_active(col=col, row=row):
                        cells.append(ActiveCell(col=col, row=row))
            return {
                'type': dict_type,
                'shape': self.shape,
                'data': [cell.to_tuple() for cell in cells]
            }

        if dict_type == 'sparse_inverse':
            inverted_raster = np.invert(self.data)
            cells = []
            for row in range(self.shape[0]):
                for col in range(self.shape[1]):
                    if inverted_raster[row, col]:
                        cells.append(ActiveCell(col=col, row=row))

            return {
                'type': dict_type,
                'shape': self.shape,
                'data': [cell.to_tuple() for cell in cells]
            }

        # save as Raster data
        empty_value = False
        return {
            'type': dict_type,
            'empty_value': empty_value,
            'shape': self.shape,
            'data': self.data.tolist()
        }

    def n_cols(self) -> int:
        return self.shape[1]

    def n_rows(self) -> int:
        return self.shape[0]

    def is_active(self, col: int, row: int) -> bool:
        return self.data[row, col] if 0 <= row < self.shape[0] and 0 <= col < self.shape[1] else False

    def set_inactive(self, col: int, row: int):
        if row < 0 or row >= self.shape[0] or col < 0 or col >= self.shape[1]:
            return
        self.data[row, col] = False

    def set_active(self, col: int, row: int):
        if row < 0 or row >= self.shape[0] or col < 0 or col >= self.shape[1]:
            return

        self.data[row, col] = True

    def to_geojson(self, grid: Grid) -> GeometryCollection:
        cells_geometries = grid.get_wgs_cell_geometries()
        cell_geometries = []
        for col in range(grid.n_cols()):
            for row in range(grid.n_rows()):
                if self.is_active(col=col, row=row):
                    cell_geometries.append(cells_geometries[row][col])

        return GeometryCollection(geometries=cell_geometries)

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
