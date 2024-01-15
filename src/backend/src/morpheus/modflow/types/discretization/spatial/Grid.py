import dataclasses
from typing import Literal, TypedDict

import numpy as np
import pyproj

from shapely import Polygon as ShapelyPolygon, Point as ShapelyPoint
from shapely.affinity import rotate as rotate

from .LengthUnit import LengthUnit
from .Rotation import Rotation
from .Crs import Crs
from ...geometry import Point, Polygon


class CreateGridDict(TypedDict):
    x_coordinates: list[float]
    y_coordinates: list[float]
    rotation: float
    length_unit: Literal["meters", "centimeters", "feet", "unknown"]


@dataclasses.dataclass(frozen=True)
class Grid:
    """
    Class that represents non-uniform rectilinear 2D grid.

    Parameters
    ----------
    origin: Point
      Top left corner of the grid
      Coordinates are given in geojson-format, WGS84, EPSG:4326
    x_distances: list[float]
        List of distances along the x-axis of the grid from origin (left to right)
        a distance for each column has to be specified
        the unit of the distances is specified by the length_unit parameter
        default meters
    y_distances: list[float]
        List of distances along the y-axis of the grid from origin (top to bottom)
        a distance for each row has to be specified
        the unit of the distances is specified by the length_unit parameter
        default meters
    rotation: Rotation
        The rotation of the grid
        Values are given in degrees from 0 to 360
        default 0.0
    length_unit: LengthUnit
        The unit of the distances
        default meters
    crs: CRS
        The mercator projection of the grid
        default EPSG:3857

    Methods
    -------
    from_polygon_with_relative_coordinates(polygon: Polygon, rotation: Rotation, length_unit: LengthUnit,
                                            x_coordinates: list[float], y_coordinates: list[float])
        Creates a grid from a polygon and relative coordinates (values between 0 and 1)
        Rotation and length_unit are optional
    nx()
        Returns the number of columns
    ny()
        Returns the number of rows
    x_coordinates()
        Returns the x-coordinates of the grid starting with 0 from top left corner
    y_coordinates()
        Returns the y-coordinates of the grid starting with 0 from top left corner
    get_cell_centers()
        Returns the cell centers as Points of the grid in a 2D list [x][y]
    get_cell_geometries()
        Returns the cell geometries as Polygons of the grid in a 2D list [x][y]
    """

    # Top left corner of the grid
    # Coordinates are given geojson, WGS84, EPSG:4326
    origin: Point

    # Non-uniform Rectilinear 2D Grid
    x_distances: list[float]
    y_distances: list[float]

    rotation: Rotation
    length_unit: LengthUnit
    crs = Crs.from_str('EPSG:3857')

    @classmethod
    def cartesian_from_polygon(cls, polygon: Polygon, rotation: Rotation, nx: int, ny: int) -> "Grid":
        x_coordinates = []
        y_coordinates = []
        for x in range(nx):
            x_coordinates.append(round(1 / nx + x_coordinates[-1] if x > 0 else 0, 5))
        x_coordinates.append(1)

        for y in range(ny):
            y_coordinates.append(round(1 / ny + y_coordinates[-1] if y > 0 else 0, 5))
        y_coordinates.append(1)

        return cls.from_polygon_with_relative_coordinates(
            polygon=polygon,
            rotation=rotation,
            x_coordinates=x_coordinates,
            y_coordinates=y_coordinates
        )

    @classmethod
    def from_polygon_with_relative_coordinates(cls, polygon: Polygon, rotation: Rotation, x_coordinates: list[float],
                                               y_coordinates: list[float]) -> "Grid":

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
        polygon_3857_0_degrees = rotate(polygon_3857, -rotation.to_float(), origin=polygon_3857.centroid)

        # get_bounding_box polygon
        bounding_box_polygon_3857_0_degrees = ShapelyPolygon(polygon_3857_0_degrees).envelope

        if not isinstance(bounding_box_polygon_3857_0_degrees, ShapelyPolygon):
            raise ValueError('Grid bounding box is not a polygon')

        min_x, min_y, max_x, max_y = bounding_box_polygon_3857_0_degrees.bounds

        x_coordinates = [percentage * (max_x - min_x) for percentage in x_coordinates]
        y_coordinates = [percentage * (max_y - min_y) for percentage in y_coordinates]

        origen_3857_0_degrees = ShapelyPoint((min_x, max_y))
        origen_3857 = rotate(geom=origen_3857_0_degrees, angle=rotation.to_float(), origin=polygon_3857.centroid)

        origen_4326 = from_3867_to_4326.transform(origen_3857.x, origen_3857.y)

        x_distances = [x_coordinates[i + 1] - x_coordinates[i] for i in range(len(x_coordinates) - 1)]
        y_distances = [y_coordinates[i + 1] - y_coordinates[i] for i in range(len(y_coordinates) - 1)]

        return Grid(
            x_distances=x_distances,
            y_distances=y_distances,
            origin=Point(coordinates=origen_4326),
            rotation=rotation,
            length_unit=LengthUnit(LengthUnit.METERS)
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            x_distances=obj['x_distances'],
            y_distances=obj['y_distances'],
            origin=Point.from_dict(obj['origin']),
            rotation=Rotation.from_value(obj['rotation']),
            length_unit=LengthUnit.from_value(obj['length_unit']),
        )

    def to_dict(self):
        return {
            'x_distances': self.x_distances,
            'y_distances': self.y_distances,
            'origin': self.origin.to_dict(),
            'rotation': self.rotation.to_value(),
            'length_unit': self.length_unit.to_value(),
        }

    def nx(self):
        return len(self.x_distances)

    def ny(self):
        return len(self.y_distances)

    def x_coordinates(self):
        x_coordinates: list[float] = [0.0]
        for x_distance in self.x_distances:
            x_coordinates.append(x_coordinates[-1] + x_distance)
        return x_coordinates

    def y_coordinates(self):
        y_coordinates: list[float] = [0.0]
        for y_distance in self.y_distances:
            y_coordinates.append(y_coordinates[-1] + y_distance)
        return y_coordinates

    def get_cell_centers(self) -> list[list[Point]]:
        x_coordinates, y_coordinates = self.x_coordinates(), self.y_coordinates()
        n_x, n_y = self.nx(), self.ny()
        centers = np.empty((n_x, n_y), dtype=Point)
        from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
        origin_3857 = from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)
        for x in range(self.nx()):
            for y in range(self.ny()):
                point_3857 = ShapelyPoint((
                    origin_3857[0] + (x_coordinates[x] + x_coordinates[x + 1]) / 2,
                    origin_3857[1] - (y_coordinates[y] + y_coordinates[y + 1]) / 2)
                )

                rotated_point_3857 = rotate(geom=point_3857, angle=self.rotation.to_float(),
                                            origin=origin_3857)  # type: ignore
                point_4326 = from_3857_to_4326.transform(rotated_point_3857.x, rotated_point_3857.y)
                centers[x][y] = Point(coordinates=point_4326)

        return centers.tolist()

    def get_cell_geometries(self) -> list[list[Polygon]]:
        x_coordinates, y_coordinates = self.x_coordinates(), self.y_coordinates()
        n_x, n_y = self.nx(), self.ny()
        geometries = np.empty((n_x, n_y), dtype=Polygon)
        from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
        origin_3857_x, origin_3857_y = from_4326_to_3857.transform(self.origin.coordinates[0],
                                                                   self.origin.coordinates[1])
        from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)

        for x in range(n_x):
            for y in range(n_y):
                polygon_3857 = ShapelyPolygon((
                    (origin_3857_x + x_coordinates[x], origin_3857_y - y_coordinates[y]),
                    (origin_3857_x + x_coordinates[x + 1], origin_3857_y - y_coordinates[y]),
                    (origin_3857_x + x_coordinates[x + 1], origin_3857_y - y_coordinates[y + 1]),
                    (origin_3857_x + x_coordinates[x], origin_3857_y - y_coordinates[y + 1]),
                    (origin_3857_x + x_coordinates[x], origin_3857_y - y_coordinates[y]),
                ))

                rotated_polygon_3857 = rotate(geom=polygon_3857, angle=self.rotation.to_float(),
                                              origin=(origin_3857_x, origin_3857_y))  # type: ignore
                geometry_4326 = [from_3857_to_4326.transform(point[0], point[1]) for point in
                                 list(rotated_polygon_3857.exterior.coords)]
                geometries[x][y] = Polygon(coordinates=[geometry_4326])
        return geometries.tolist()

    def as_geojson(self):
        x_coordinates, y_coordinates = self.x_coordinates(), self.y_coordinates()
        from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
        from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)
        origin_3857_x, origin_3857_y = from_4326_to_3857.transform(self.origin.coordinates[0],
                                                                   self.origin.coordinates[1])

        polygon_3857 = ShapelyPolygon((
            (origin_3857_x, origin_3857_y),
            (origin_3857_x + x_coordinates[-1], origin_3857_y),
            (origin_3857_x + x_coordinates[-1], origin_3857_y - y_coordinates[-1]),
            (origin_3857_x, origin_3857_y - y_coordinates[-1]),
            (origin_3857_x, origin_3857_y),
        ))

        rotated_polygon_3857 = rotate(polygon_3857, self.rotation.to_float(),
                                      origin=(origin_3857_x, origin_3857_y))  # type: ignore
        geometry_4326 = [from_3857_to_4326.transform(point[0], point[1]) for point in
                         list(rotated_polygon_3857.exterior.coords)]
        return Polygon(coordinates=[geometry_4326])
