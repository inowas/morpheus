from shapely import Polygon as ShapelyPolygon, Point as ShapelyPoint, LineString as ShapelyLineString
from shapely.ops import unary_union

from morpheus.modflow.types.discretization.spatial.SpatialDiscretization import Polygon, Grid, Point, GridCells
from morpheus.modflow.types.geometry import GeometryCollection, LineString


def calculate_affected_cells_geometries(cells: GridCells, grid: Grid) -> GeometryCollection:
    cells_geometries = grid.get_cell_geometries()
    geometries = []
    for x in range(grid.nx()):
        for y in range(grid.ny()):
            if cells.get_cell(x=x, y=y):
                geometries.append(cells_geometries[x][y])
    return GeometryCollection(geometries=geometries)


def calculate_merged_affected_cells_geometries(cells: GridCells, grid: Grid) -> Polygon:
    geometries = calculate_affected_cells_geometries(cells, grid).geometries
    geometries = [ShapelyPolygon(geometry.coordinates[0]) for geometry in geometries]
    geometry = unary_union(geometries)
    if isinstance(geometry, ShapelyPolygon):
        geometry_dict = geometry.__geo_interface__
        return Polygon(coordinates=geometry_dict['coordinates'])

    raise Exception(f'Merged cells geometry is not a polygon, but a {type(geometry)}')


def calculate_cells_from_polygon(geometry: Polygon, grid: Grid) -> GridCells:
    affected_cells = GridCells.empty_from_shape(nx=grid.nx(), ny=grid.ny())
    area = ShapelyPolygon(geometry.coordinates[0])
    grid_cell_centers = grid.get_cell_centers()
    for x in range(grid.nx()):
        for y in range(grid.ny()):
            center = ShapelyPoint(grid_cell_centers[x][y].coordinates)
            if area.contains(center):
                affected_cells.set_cell(x=x, y=y, value=True)

    return affected_cells


def calculate_cells_from_point(point: Point, grid: Grid) -> GridCells:
    affected_cells = GridCells.empty_from_shape(nx=grid.nx(), ny=grid.ny())
    point = ShapelyPoint(point.coordinates)
    grid_cell_geometries = grid.get_cell_geometries()
    for x in range(grid.nx()):
        for y in range(grid.ny()):
            grid_cell_geometry = ShapelyPolygon(grid_cell_geometries[y][x].coordinates[0])
            if grid_cell_geometry.contains(point):
                affected_cells.set_cell(x=x, y=y, value=True)

    return affected_cells


def calculate_cells_from_linestring(linestring: LineString, grid: Grid) -> GridCells:
    affected_cells = GridCells.empty_from_shape(nx=grid.nx(), ny=grid.ny())
    grid_cell_geometries = grid.get_cell_geometries()
    linestring = ShapelyLineString(linestring.coordinates)

    for x in range(grid.nx()):
        for y in range(grid.ny()):
            grid_cell_geometry = ShapelyPolygon(grid_cell_geometries[y][x].coordinates[0])
            if grid_cell_geometry.intersects(linestring):
                affected_cells.set_cell(x=x, y=y, value=True)

    return affected_cells
