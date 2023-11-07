import numpy as np
import pyproj

from morpheus.modflow.types.SpatialDiscretization import Rotation, Polygon, LengthUnit, Grid, Point, AffectedCells
from shapely import affinity, Polygon as ShapelyPolygon, Point as ShapelyPoint


def grid_from_polygon(polygon: Polygon, rotation: Rotation, length_unit: LengthUnit,
                      x_coordinates: list[float], y_coordinates: list[float]) -> Grid:
    if len(x_coordinates) < 1 or len(y_coordinates) < 1:
        raise ValueError('percentages must have at least one element')
    if x_coordinates[0] != 0 or y_coordinates[0] != 0:
        raise ValueError('percentages must start with 0')
    if x_coordinates[-1] != 1 or y_coordinates[-1] != 1:
        raise ValueError('percentages must end with 1')
    if any([percentage < 0 or percentage > 1 for percentage in x_coordinates + y_coordinates]):
        raise ValueError('percentages must be between 0 and 1')

    polygon = ShapelyPolygon(polygon.coordinates[0])
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

    return Grid(
        x_coordinates=x_coordinates,
        y_coordinates=y_coordinates,
        origin=Point(coordinates=origen_4326),
        rotation=rotation,
        length_unit=length_unit
    )


def calculate_grid_cell_centers(grid: Grid) -> list[list[Point]]:
    centers = np.empty((grid.ny(), grid.nx()), dtype=Point)
    from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
    origin_3857 = from_4326_to_3857.transform(grid.origin.coordinates[0], grid.origin.coordinates[1])
    from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)
    for y in range(grid.ny()):
        for x in range(grid.nx()):
            point_3857 = ShapelyPoint((
                origin_3857[0] + (grid.x_coordinates[x] + grid.x_coordinates[x + 1]) / 2,
                origin_3857[1] + (grid.y_coordinates[y] + grid.y_coordinates[y + 1]) / 2)
            )

            rotated_point_3857 = affinity.rotate(point_3857, grid.rotation.to_float(),
                                                 origin=origin_3857)  # type: ignore
            point_4326 = from_3857_to_4326.transform(rotated_point_3857.x, rotated_point_3857.y)
            centers[y][x] = Point(coordinates=point_4326)

    return centers.tolist()


def calculate_grid_cell_geometries(grid: Grid) -> list[list[Polygon]]:
    geometries = np.empty((grid.ny(), grid.nx()), dtype=Polygon)
    from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
    origin_3857 = from_4326_to_3857.transform(grid.origin.coordinates[0], grid.origin.coordinates[1])
    from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)

    for y in range(grid.ny()):
        for x in range(grid.nx()):
            polygon_3857 = ShapelyPolygon((
                (origin_3857[0] + grid.x_coordinates[x], origin_3857[1] + grid.y_coordinates[y]),
                (origin_3857[0] + grid.x_coordinates[x + 1], origin_3857[1] + grid.y_coordinates[y]),
                (origin_3857[0] + grid.x_coordinates[x + 1], origin_3857[1] + grid.y_coordinates[y + 1]),
                (origin_3857[0] + grid.x_coordinates[x], origin_3857[1] + grid.y_coordinates[y + 1]),
                (origin_3857[0] + grid.x_coordinates[x], origin_3857[1] + grid.y_coordinates[y]),
            ))

            rotated_polygon_3857 = affinity.rotate(polygon_3857, grid.rotation.to_float(),
                                                   origin=origin_3857)  # type: ignore
            geometry_4326 = [from_3857_to_4326.transform(point[0], point[1]) for point in
                             list(rotated_polygon_3857.exterior.coords)]
            geometries[y][x] = Polygon(coordinates=[geometry_4326])
    return geometries.tolist()


def calculate_grid_geometry(grid: Grid) -> Polygon:
    from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
    from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)
    origin_3857 = from_4326_to_3857.transform(grid.origin.coordinates[0], grid.origin.coordinates[1])

    polygon_3857 = ShapelyPolygon((
        origin_3857,
        (origin_3857[0] + grid.x_coordinates[-1], origin_3857[1]),
        (origin_3857[0] + grid.x_coordinates[-1], origin_3857[1] + grid.y_coordinates[-1]),
        (origin_3857[0], origin_3857[1] + grid.y_coordinates[-1]),
        origin_3857,
    ))

    rotated_polygon_3857 = affinity.rotate(polygon_3857, grid.rotation.to_float(), origin=origin_3857)  # type: ignore
    geometry_4326 = [from_3857_to_4326.transform(point[0], point[1]) for point in
                     list(rotated_polygon_3857.exterior.coords)]
    return Polygon(coordinates=[geometry_4326])


def calculate_affected_cells(geometry: Polygon, grid: Grid) -> AffectedCells:
    affected_cells = AffectedCells.empty_from_shape(nx=grid.nx(), ny=grid.ny())
    area = ShapelyPolygon(geometry.coordinates[0])
    grid_cell_centers = calculate_grid_cell_centers(grid)
    for x in range(grid.nx()):
        for y in range(grid.ny()):
            center = ShapelyPoint(grid_cell_centers[y][x].coordinates)
            affected_cells.set_cell_value(x=x, y=y, value=area.contains(center))

    return affected_cells
