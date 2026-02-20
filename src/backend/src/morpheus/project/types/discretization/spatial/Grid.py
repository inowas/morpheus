import dataclasses

import numpy as np
import pyproj
from shapely import Point as ShapelyPoint
from shapely import Polygon as ShapelyPolygon
from shapely.affinity import rotate as rotate

from ...geometry import Point, Polygon
from ...geometry.Feature import Feature
from ...geometry.FeatureCollection import FeatureCollection
from .Crs import Crs
from .LengthUnit import LengthUnit
from .Rotation import Rotation


@dataclasses.dataclass
class Grid:
    """
    Class that represents non-uniform rectilinear 2D grid.

    Parameters
    ----------
    origin: Point
      Top left corner of the grid
      Coordinates are given in geojson-format, WGS84, EPSG:4326
    col_widths: list[float]
        List of absolute length for each column of the grid (left to right)
        a length for each column has to be specified
        the unit of the distances is specified by the length_unit parameter
        default meters
    total_width: float
        Total length of the grid in x-direction
    row_heights: list[float]
        List of absolute length for each row of the grid (top to bottom)
        the unit of the distances is specified by the length_unit parameter
        default meters
    total_height: float
        Total length of the grid in y-direction
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
    cartesian_from_polygon(polygon: Polygon, rotation: Rotation, n_cols: int, n_rows: int) -> Grid
        Creates a non-uniform 2D grid from a polygon with n_cols columns and n_rows rows
    from_polygon_with_relative_coordinates(polygon: Polygon, rotation: Rotation, relative_col_coordinates: list[float], relative_row_coordinates: list[float]) -> Grid
        Creates a non-uniform rectilinear 2D grid from a polygon with relative column and row coordinates
    n_cols()
        Returns the number of columns
    n_rows()
        Returns the number of rows
    col_coordinates()
        Returns the coordinates of the columns along the x-axis, starting with 0 from the left
    row_coordinates()
        Returns the coordinates of the rows along the y-axis, starting with 0 from the top
    get_cell_centers()
        Returns the cell centers as Points of the grid in a 2D list [x][y]
    get_cell_geometries()
        Returns the cell geometries as Polygons of the grid in a 2D list [x][y]
    """

    # Top left corner of the grid
    # Coordinates are given geojson, WGS84, EPSG:4326 or in defined crs
    origin: Point

    # Non-uniform Rectilinear 2D Grid
    col_widths: list[float]
    total_width: float

    row_heights: list[float]
    total_height: float

    rotation: Rotation
    length_unit: LengthUnit
    crs = Crs.from_str('EPSG:3857')

    _from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
    _from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)

    @classmethod
    def cartesian_from_polygon(cls, polygon: Polygon, rotation: Rotation, n_cols: int, n_rows: int) -> 'Grid':
        relative_col_coordinates = []
        relative_row_coordinates = []
        for col in range(n_cols):
            relative_col_coordinates.append(round(1 / n_cols + relative_col_coordinates[-1] if col > 0 else 0, 5))
        relative_col_coordinates.append(1)

        for row in range(n_rows):
            relative_row_coordinates.append(round(1 / n_rows + relative_row_coordinates[-1] if row > 0 else 0, 5))
        relative_row_coordinates.append(1)

        return cls.from_polygon_with_relative_coordinates(
            polygon=polygon, rotation=rotation, relative_col_coordinates=relative_col_coordinates, relative_row_coordinates=relative_row_coordinates
        )

    @classmethod
    def from_polygon_with_relative_coordinates(cls, polygon: Polygon, rotation: Rotation, relative_col_coordinates: list[float], relative_row_coordinates: list[float]) -> 'Grid':

        if len(relative_col_coordinates) < 1 or len(relative_row_coordinates) < 1:
            raise ValueError('percentages must have at least one element')
        if relative_col_coordinates[0] != 0 or relative_row_coordinates[0] != 0:
            raise ValueError('percentages must start with 0')
        if relative_col_coordinates[-1] != 1 or relative_row_coordinates[-1] != 1:
            raise ValueError('percentages must end with 1')
        if any([percentage < 0 or percentage > 1 for percentage in relative_col_coordinates + relative_row_coordinates]):
            raise ValueError('percentages must be between 0 and 1')

        shapely_polygon = ShapelyPolygon(polygon.coordinates[0])
        from_4326_to_3857 = pyproj.Transformer.from_crs(4326, 3857, always_xy=True)
        from_3867_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)

        # transform polygon to 3857
        polygon_3857 = ShapelyPolygon([from_4326_to_3857.transform(x, y) for x, y in shapely_polygon.exterior.coords])

        # rotate polygon to 0 degrees
        polygon_3857_0_degrees = rotate(polygon_3857, -rotation.to_float(), origin=polygon_3857.centroid)

        # get_bounding_box polygon
        bounding_box_polygon_3857_0_degrees = ShapelyPolygon(polygon_3857_0_degrees).envelope

        if not isinstance(bounding_box_polygon_3857_0_degrees, ShapelyPolygon):
            raise ValueError('Grid bounding box is not a polygon')

        min_x, min_y, max_x, max_y = bounding_box_polygon_3857_0_degrees.bounds

        absolute_col_coordinates = [percentage * (max_x - min_x) for percentage in relative_col_coordinates]
        absolute_row_coordinates = [percentage * (max_y - min_y) for percentage in relative_row_coordinates]

        origen_3857_0_degrees = ShapelyPoint((min_x, max_y))
        origen_3857: ShapelyPoint = rotate(geom=origen_3857_0_degrees, angle=rotation.to_float(), origin=polygon_3857.centroid)

        origen_4326 = from_3867_to_4326.transform(origen_3857.x, origen_3857.y)

        del_col_absolute = [absolute_col_coordinates[i + 1] - absolute_col_coordinates[i] for i in range(len(absolute_col_coordinates) - 1)]
        del_row_absolute = [absolute_row_coordinates[i + 1] - absolute_row_coordinates[i] for i in range(len(absolute_row_coordinates) - 1)]

        return Grid(
            origin=Point(coordinates=origen_4326),
            rotation=rotation,
            length_unit=LengthUnit(LengthUnit.METERS),
            col_widths=del_col_absolute,
            total_width=absolute_col_coordinates[-1],
            row_heights=del_row_absolute,
            total_height=absolute_row_coordinates[-1],
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            col_widths=obj['col_widths'],
            total_width=obj['total_width'],
            row_heights=obj['row_heights'],
            total_height=obj['total_height'],
            origin=Point.from_dict(obj['origin']),
            rotation=Rotation.from_value(obj['rotation']),
            length_unit=LengthUnit.from_value(obj['length_unit']),
        )

    def to_dict(self):
        return {
            'n_cols': self.n_cols(),
            'n_rows': self.n_rows(),
            'col_widths': self.col_widths,
            'total_width': self.total_width,
            'row_heights': self.row_heights,
            'total_height': self.total_height,
            'origin': self.origin.to_dict(),
            'rotation': self.rotation.to_value(),
            'length_unit': self.length_unit.to_value(),
            'bounding_box': self.get_wgs_bbox(),
        }

    def to_geojson(self) -> FeatureCollection:
        features = [self.get_wgs_outline_geometry()]
        features += self.get_wgs_column_geometries()
        features += self.get_wgs_row_geometries()
        return FeatureCollection(features=features)

    def with_updated_geometry(self, polygon: Polygon, preserve_absolute_coordinates: bool = False):
        if preserve_absolute_coordinates:
            raise NotImplementedError('Resize Grid with Flag preserve_absolute_coordinates set to True is not implemented  yet!')

        return Grid.from_polygon_with_relative_coordinates(
            polygon=polygon, rotation=self.rotation, relative_col_coordinates=self.col_coordinates_relative(), relative_row_coordinates=self.row_coordinates_relative()
        )

    def n_cols(self):
        return len(self.col_widths)

    def n_rows(self):
        return len(self.row_heights)

    def col_coordinates(self):
        col_coordinates: list[float] = [0.0]
        for del_col_absolute in self.col_widths:
            col_coordinates.append(col_coordinates[-1] + del_col_absolute)
        return col_coordinates

    def col_coordinates_relative(self):
        col_coordinates = self.col_coordinates()
        return [col_coordinates[i] / self.total_width for i in range(len(col_coordinates))]

    def row_coordinates(self):
        row_coordinates: list[float] = [0.0]
        for del_row_absolute in self.row_heights:
            row_coordinates.append(row_coordinates[-1] + del_row_absolute)
        return row_coordinates

    def row_coordinates_relative(self):
        row_coordinates = self.row_coordinates()
        return [row_coordinates[i] / self.total_height for i in range(len(row_coordinates))]

    def get_mercator_cell_center_coordinates(self) -> tuple[list[list[float]], list[list[float]]]:
        cell_centers = self.get_mercator_cell_centers()
        xx_coords = [[point.coordinates[0] for point in row] for row in cell_centers]
        yy_coords = [[point.coordinates[1] for point in row] for row in cell_centers]
        return xx_coords, yy_coords

    def get_mercator_cell_centers(self) -> list[list[Point]]:
        col_coordinates, row_coordinates = self.col_coordinates(), self.row_coordinates()
        n_cols, n_rows = self.n_cols(), self.n_rows()
        centers = np.empty((n_rows, n_cols), dtype=Point)
        origin_3857 = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        for row in range(self.n_rows()):
            for col in range(self.n_cols()):
                point_3857 = ShapelyPoint(
                    (origin_3857[0] + (col_coordinates[col] + col_coordinates[col + 1]) / 2, origin_3857[1] - (row_coordinates[row] + row_coordinates[row + 1]) / 2)
                )

                rotated_point_3857: ShapelyPoint = rotate(geom=point_3857, angle=self.rotation.to_float(), origin=origin_3857)  # type: ignore
                centers[row][col] = Point(coordinates=rotated_point_3857.__geo_interface__['coordinates'])

        return centers.tolist()

    def get_wgs_cell_center_coordinates(self) -> tuple[list[list[float]], list[list[float]]]:
        cell_centers = self.get_wgs_cell_centers()
        xx_coords = [[point.coordinates[0] for point in row] for row in cell_centers]
        yy_coords = [[point.coordinates[1] for point in row] for row in cell_centers]
        return xx_coords, yy_coords

    def get_wgs_cell_centers(self) -> list[list[Point]]:
        col_coordinates, row_coordinates = self.col_coordinates(), self.row_coordinates()
        n_cols, n_rows = self.n_cols(), self.n_rows()
        centers = np.empty((n_rows, n_cols), dtype=Point)

        origin_3857 = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)
        for row in range(self.n_rows()):
            for col in range(self.n_cols()):
                point_3857 = ShapelyPoint(
                    (origin_3857[0] + (col_coordinates[col] + col_coordinates[col + 1]) / 2, origin_3857[1] - (row_coordinates[row] + row_coordinates[row + 1]) / 2)
                )

                rotated_point_3857: ShapelyPoint = rotate(geom=point_3857, angle=self.rotation.to_float(), origin=origin_3857)  # type: ignore
                point_4326 = from_3857_to_4326.transform(rotated_point_3857.x, rotated_point_3857.y)
                centers[row][col] = Point(coordinates=point_4326)

        return centers.tolist()

    def get_wgs_cell_geometries(self) -> list[list[Polygon]]:
        col_coordinates, row_coordinates = self.col_coordinates(), self.row_coordinates()
        n_cols, n_rows = self.n_cols(), self.n_rows()
        geometries = np.empty((n_rows, n_cols), dtype=Polygon)
        origin_3857_x, origin_3857_y = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        from_3857_to_4326 = pyproj.Transformer.from_crs(3857, 4326, always_xy=True)

        for row in range(n_rows):
            for col in range(n_cols):
                polygon_3857 = ShapelyPolygon(
                    (
                        (origin_3857_x + col_coordinates[col], origin_3857_y - row_coordinates[row]),
                        (origin_3857_x + col_coordinates[col + 1], origin_3857_y - row_coordinates[row]),
                        (origin_3857_x + col_coordinates[col + 1], origin_3857_y - row_coordinates[row + 1]),
                        (origin_3857_x + col_coordinates[col], origin_3857_y - row_coordinates[row + 1]),
                        (origin_3857_x + col_coordinates[col], origin_3857_y - row_coordinates[row]),
                    )
                )

                rotated_polygon_3857 = rotate(geom=polygon_3857, angle=self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore
                geometry_4326 = [from_3857_to_4326.transform(point[0], point[1]) for point in list(rotated_polygon_3857.exterior.coords)]
                geometries[row][col] = Polygon(coordinates=[geometry_4326])
        return geometries.tolist()

    def get_wgs_row_geometries(self) -> list[Feature]:
        col_coordinates, row_coordinates = self.col_coordinates(), self.row_coordinates()
        n_rows = self.n_rows()
        features = np.empty(n_rows, dtype=Polygon)

        origin_3857_x, origin_3857_y = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])

        for row in range(n_rows):
            polygon_3857 = ShapelyPolygon(
                (
                    (origin_3857_x, origin_3857_y - row_coordinates[row]),
                    (origin_3857_x + col_coordinates[-1], origin_3857_y - row_coordinates[row]),
                    (origin_3857_x + col_coordinates[-1], origin_3857_y - row_coordinates[row + 1]),
                    (origin_3857_x, origin_3857_y - row_coordinates[row + 1]),
                    (origin_3857_x, origin_3857_y - row_coordinates[row]),
                )
            )

            rotated_polygon_3857 = rotate(geom=polygon_3857, angle=self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore
            geometry_4326 = [self._from_3857_to_4326.transform(point[0], point[1]) for point in list(rotated_polygon_3857.exterior.coords)]
            features[row] = Feature(geometry=Polygon(coordinates=[geometry_4326]), properties={'row': row, 'type': 'row'})

        return features.tolist()

    def get_wgs_column_geometries(self) -> list[Feature]:
        col_coordinates, row_coordinates = self.col_coordinates(), self.row_coordinates()
        n_cols = self.n_cols()
        features = np.empty(n_cols, dtype=Polygon)
        origin_3857_x, origin_3857_y = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])

        for col in range(n_cols):
            polygon_3857 = ShapelyPolygon(
                (
                    (origin_3857_x + col_coordinates[col], origin_3857_y),
                    (origin_3857_x + col_coordinates[col + 1], origin_3857_y),
                    (origin_3857_x + col_coordinates[col + 1], origin_3857_y - row_coordinates[-1]),
                    (origin_3857_x + col_coordinates[col], origin_3857_y - row_coordinates[-1]),
                    (origin_3857_x + col_coordinates[col], origin_3857_y),
                )
            )

            rotated_polygon_3857 = rotate(geom=polygon_3857, angle=self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore
            geometry_4326 = [self._from_3857_to_4326.transform(point[0], point[1]) for point in list(rotated_polygon_3857.exterior.coords)]
            features[col] = Feature(geometry=Polygon(coordinates=[geometry_4326]), properties={'col': col, 'type': 'col'})

        return features.tolist()

    def get_wgs_outline_geometry(self) -> Feature:
        col_coordinates, row_coordinates = self.col_coordinates(), self.row_coordinates()

        origin_3857_x, origin_3857_y = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])

        polygon_3857 = ShapelyPolygon(
            (
                (origin_3857_x, origin_3857_y),
                (origin_3857_x + col_coordinates[-1], origin_3857_y),
                (origin_3857_x + col_coordinates[-1], origin_3857_y - row_coordinates[-1]),
                (origin_3857_x, origin_3857_y - row_coordinates[-1]),
                (origin_3857_x, origin_3857_y),
            )
        )

        rotated_polygon_3857 = rotate(polygon_3857, self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore
        geometry_4326 = [self._from_3857_to_4326.transform(point[0], point[1]) for point in list(rotated_polygon_3857.exterior.coords)]
        return Feature(geometry=Polygon(coordinates=[geometry_4326]), properties={'type': 'bounding_box'})

    def get_wgs_width_height(self) -> tuple[float, float]:
        origin_3857_x, origin_3857_y = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        corner_upper_left = ShapelyPoint((origin_3857_x, origin_3857_y))
        corner_upper_right = ShapelyPoint((origin_3857_x + self.total_width), origin_3857_y)
        corner_lower_left = ShapelyPoint(origin_3857_x, (origin_3857_y - self.total_height))

        rotated_corner_upper_left = rotate(corner_upper_left, self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore
        rotated_corner_upper_right = rotate(corner_upper_right, self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore
        rotated_corner_lower_left = rotate(corner_lower_left, self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore

        corner_upper_left_4326 = ShapelyPoint(self._from_3857_to_4326.transform(rotated_corner_upper_left.x, rotated_corner_upper_left.y))
        corner_upper_right_4326 = ShapelyPoint(self._from_3857_to_4326.transform(rotated_corner_upper_right.x, rotated_corner_upper_right.y))
        corner_lower_left_4326 = ShapelyPoint(self._from_3857_to_4326.transform(rotated_corner_lower_left.x, rotated_corner_lower_left.y))

        width = corner_upper_left_4326.distance(corner_upper_right_4326)
        height = corner_upper_left_4326.distance(corner_lower_left_4326)

        return width, height

    def get_wgs_bbox(self) -> tuple[float, float, float, float]:
        origin_3857_x, origin_3857_y = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        col_coordinates, row_coordinates = self.col_coordinates(), self.row_coordinates()

        polygon_3857 = ShapelyPolygon(
            (
                (origin_3857_x, origin_3857_y),
                (origin_3857_x + col_coordinates[-1], origin_3857_y),
                (origin_3857_x + col_coordinates[-1], origin_3857_y - row_coordinates[-1]),
                (origin_3857_x, origin_3857_y - row_coordinates[-1]),
                (origin_3857_x, origin_3857_y),
            )
        )

        rotated_polygon_3857 = rotate(polygon_3857, self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore
        geometry_4326 = [self._from_3857_to_4326.transform(point[0], point[1]) for point in list(rotated_polygon_3857.exterior.coords)]

        return ShapelyPolygon(geometry_4326).bounds

    def get_bbox_aspect_ratio(self) -> float:

        origin_3857_x, origin_3857_y = self._from_4326_to_3857.transform(self.origin.coordinates[0], self.origin.coordinates[1])
        col_coordinates, row_coordinates = self.col_coordinates(), self.row_coordinates()

        polygon_3857 = ShapelyPolygon(
            (
                (origin_3857_x, origin_3857_y),
                (origin_3857_x + col_coordinates[-1], origin_3857_y),
                (origin_3857_x + col_coordinates[-1], origin_3857_y - row_coordinates[-1]),
                (origin_3857_x, origin_3857_y - row_coordinates[-1]),
                (origin_3857_x, origin_3857_y),
            )
        )

        rotated_polygon_3857 = rotate(polygon_3857, self.rotation.to_float(), origin=(origin_3857_x, origin_3857_y))  # type: ignore
        return (rotated_polygon_3857.bounds[2] - rotated_polygon_3857.bounds[0]) / (rotated_polygon_3857.bounds[3] - rotated_polygon_3857.bounds[1])

    def to_cartesian_grid(self, n_cols: int) -> 'Grid':

        aspect_ratio = self.get_bbox_aspect_ratio()
        n_rows = int(n_cols / aspect_ratio)

        relative_col_coordinates = []
        for col in range(n_cols):
            relative_col_coordinates.append(round(1 / n_cols + relative_col_coordinates[-1] if col > 0 else 0, 5))
        relative_col_coordinates.append(1)

        relative_row_coordinates = []
        for row in range(n_rows):
            relative_row_coordinates.append(round(1 / n_rows + relative_row_coordinates[-1] if row > 0 else 0, 5))
        relative_row_coordinates.append(1)

        (min_x, min_y, max_x, max_y) = self.get_wgs_bbox()
        polygon = Polygon(coordinates=[[(min_x, max_y), (max_x, max_y), (max_x, min_y), (min_x, min_y), (min_x, max_y)]])

        new_grid = Grid.from_polygon_with_relative_coordinates(
            polygon=polygon, rotation=Rotation.from_float(0.0), relative_col_coordinates=relative_col_coordinates, relative_row_coordinates=relative_row_coordinates
        )

        return new_grid

    def to_grid_with_equal_cells(self, n_cols: int) -> 'Grid':
        col_coordinates_relative = []
        for col in range(n_cols):
            col_coordinates_relative.append(round(1 / n_cols + col_coordinates_relative[-1] if col > 0 else 0, 5))
        col_coordinates_relative.append(1)

        aspect_ratio = self.total_width / self.total_height
        n_rows = int(n_cols / aspect_ratio)

        row_coordinates_relative = []
        for row in range(n_rows):
            row_coordinates_relative.append(round(1 / n_rows + row_coordinates_relative[-1] if row > 0 else 0, 5))
        row_coordinates_relative.append(1)

        polygon = self.get_wgs_outline_geometry().geometry
        if not isinstance(polygon, Polygon):
            raise ValueError('Grid bounding box is not a polygon')

        return Grid.from_polygon_with_relative_coordinates(
            polygon=polygon, rotation=self.rotation, relative_col_coordinates=col_coordinates_relative, relative_row_coordinates=row_coordinates_relative
        )

    def is_regular(self) -> bool:
        # Check if all columns and rows does not differ more than 10% from the average
        average_col_width = sum(self.col_widths) / len(self.col_widths)
        average_row_height = sum(self.row_heights) / len(self.row_heights)
        return all([abs(width - average_col_width) / average_col_width < 0.1 for width in self.col_widths]) and all(
            [abs(height - average_row_height) / average_row_height < 0.1 for height in self.row_heights]
        )
