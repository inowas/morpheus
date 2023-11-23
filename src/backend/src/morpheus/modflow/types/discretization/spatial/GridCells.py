import dataclasses
from shapely import LineString as ShapelyLineString, Point as ShapelyPoint, Polygon as ShapelyPolygon
from shapely.ops import unary_union
from morpheus.modflow.types.discretization.spatial import Grid
from morpheus.modflow.types.geometry import GeometryCollection, Polygon, Point, LineString


@dataclasses.dataclass
class GridCell:
    x: int
    y: int
    value: bool | float

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            x=obj['x'],
            y=obj['y'],
            value=obj['value']
        )

    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'value': self.value
        }


@dataclasses.dataclass
class GridCells:
    shape: tuple[int, int]
    data: list[GridCell]

    def __len__(self):
        return len(self.data)

    @classmethod
    def empty_from_shape(cls, nx: int, ny: int):
        return cls(
            shape=(nx, ny),
            data=[]
        )

    @classmethod
    def from_linestring(cls, linestring: LineString, grid: Grid):
        cells = GridCells.empty_from_shape(nx=grid.nx(), ny=grid.ny())
        geometries = grid.get_cell_geometries()
        linestring = ShapelyLineString(linestring.coordinates)

        for x in range(grid.nx()):
            for y in range(grid.ny()):
                grid_cell_geometry = ShapelyPolygon(geometries[x][y].coordinates[0])
                if grid_cell_geometry.intersects(linestring):
                    cells.set_cell(x=x, y=y, value=True)

        return cells

    @classmethod
    def from_polygon(cls, polygon: Polygon, grid: Grid):
        cells = cls.empty_from_shape(grid.nx(), grid.ny())
        area = ShapelyPolygon(polygon.coordinates[0])
        grid_cell_centers = grid.get_cell_centers()
        for x in range(grid.nx()):
            for y in range(grid.ny()):
                center = ShapelyPoint(grid_cell_centers[x][y].coordinates)
                if area.contains(center):
                    cells.set_cell(x=x, y=y, value=True)

        return cells

    @classmethod
    def from_point(cls, point: Point, grid: Grid):
        cells = GridCells.empty_from_shape(nx=grid.nx(), ny=grid.ny())
        point = ShapelyPoint(point.coordinates)
        grid_cell_geometries = grid.get_cell_geometries()
        for x in range(grid.nx()):
            for y in range(grid.ny()):
                grid_cell_geometry = ShapelyPolygon(grid_cell_geometries[x][y].coordinates[0])
                if grid_cell_geometry.contains(point):
                    cells.set_cell(x=x, y=y, value=True)

        return cells

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            shape=obj['shape'],
            data=[GridCell.from_dict(cell) for cell in obj['data']]
        )

    def to_dict(self):
        return {
            'shape': self.shape,
            'data': [cell.to_dict() for cell in self.data]
        }

    def get_cell(self, x: int, y: int) -> GridCell | None:
        if x < 0 or x >= self.shape[0] or y < 0 or y >= self.shape[1]:
            return None

        try:
            return next(cell for cell in self.data if cell.x == x and cell.y == y)
        except StopIteration:
            return None

    def set_cell(self, value: bool, x: int, y: int):
        if x < 0 or x >= self.shape[0] or y < 0 or y >= self.shape[1]:
            return

        existing_cell = self.get_cell(x=x, y=y)
        if existing_cell:
            existing_cell.value = value
            return

        self.data.append(GridCell(x=x, y=y, value=value))

    def as_geojson(self, grid: Grid):
        cells_geometries = grid.get_cell_geometries()
        geometries = []
        for x in range(grid.nx()):
            for y in range(grid.ny()):
                if self.get_cell(x=x, y=y):
                    geometries.append(cells_geometries[x][y])
        return GeometryCollection(geometries=geometries)

    def as_geojson_outline(self, grid: Grid) -> Polygon:
        geometries = self.as_geojson(grid).geometries
        geometries = [ShapelyPolygon(geometry.coordinates[0]) for geometry in geometries]
        geometry = unary_union(geometries)
        if isinstance(geometry, ShapelyPolygon):
            geometry_dict = geometry.__geo_interface__
            return Polygon(coordinates=geometry_dict['coordinates'])

        raise Exception(f'Merged cells geometry is not a polygon, but a {type(geometry)}')
