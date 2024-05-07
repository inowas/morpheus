from enum import StrEnum
from typing import Any

import numpy as np
from scipy.interpolate import LinearNDInterpolator, NearestNDInterpolator
from scipy.ndimage import generic_filter

from morpheus.project.types.discretization.spatial import Grid
from .types.RasterData import RasterData

IData = list[list[float | None]] | list[list[float]] | float


class InterpolationMethod(StrEnum):
    linear = 'linear'
    nearest = 'nearest'

    @classmethod
    def _missing_(cls, value):
        return cls.linear


class RasterInterpolationService:

    @staticmethod
    def expand_island(data, iterations=1):
        """
        Expand the island of non-nan values in the data array by iteratively replacing
        nan values with the nearest non-nan neighbor.

        :param data: A 2D numpy array containing float values and nans.
        :param iterations: Maximum number of iterations to perform (to prevent infinite loops).
        :return: A 2D numpy array with expanded islands.
        """

        # Define the replacement function
        def replace_nan_with_neighbors(values):
            center = values[4]  # 4 is the index of the center in a 3x3 footprint
            if np.isnan(center):
                non_nans = values[~np.isnan(values)]
                if non_nans.size > 0:
                    return non_nans[0]  # Replace with first non-nan value found
            return center

        # Define the 3x3 footprint
        footprint = np.array([[1, 1, 1],
                              [1, 1, 1],
                              [1, 1, 1]])

        # Perform the iterative expansion
        for _ in range(iterations):
            new_data = generic_filter(data, replace_nan_with_neighbors, footprint=footprint, mode='constant', cval=np.nan)
            if np.array_equal(new_data, data):
                break  # No change means we can stop iterating
            data = new_data

        return data

    @staticmethod
    def raster_data_to_grid_data(
        raster_data: RasterData,
        grid: Grid,
        method: InterpolationMethod = InterpolationMethod.linear,
        no_data_value: float = -9999
    ) -> tuple[list[list[float]], float]:

        src_xx = np.array(raster_data.get_xx_centers())
        src_yy = np.array(raster_data.get_yy_centers())
        src_data = np.array(raster_data.get_data())
        src_data = np.where(raster_data == no_data_value, np.nan, src_data)

        try:
            if method == InterpolationMethod.nearest:
                interp = NearestNDInterpolator(list(zip(src_xx.ravel(), src_yy.ravel())), src_data.ravel())
            else:
                interp = LinearNDInterpolator(list(zip(src_xx.ravel(), src_yy.ravel())), src_data.ravel(), fill_value=np.nan, rescale=True)
        except Exception as e:
            raise ValueError(f'Failed to interpolate raster: {e}')

        grid_xx, grid_yy = grid.get_wgs_cell_center_coordinates()

        grid_xx = np.array(grid_xx)
        grid_yy = np.array(grid_yy)
        grid_data = interp((grid_xx, grid_yy))

        grid_data = RasterInterpolationService.expand_island(grid_data, 1)
        grid_data[np.isnan(grid_data)] = no_data_value

        return grid_data.tolist(), no_data_value

    @staticmethod
    def grid_to_raster_data(grid: Grid, data: IData, no_data_value: Any = None, target_resolution_x: int = 256,
                            method: InterpolationMethod = InterpolationMethod.linear) -> RasterData:
        # get grid coordinates
        xx_coords, yy_coords = grid.get_wgs_cell_center_coordinates()
        xx_coords = np.array(xx_coords)
        yy_coords = np.array(yy_coords)

        # keep aspect ratio
        aspect_ratio = grid.get_bbox_aspect_ratio()
        target_resolution_y = int(target_resolution_x / aspect_ratio)

        grid_data = np.array(data)
        grid_data = np.where(grid_data == no_data_value, np.nan, grid_data)

        if isinstance(data, (int, float)):
            grid_data = np.ones_like(xx_coords) * data

        if method == InterpolationMethod.nearest:
            interp = NearestNDInterpolator(list(zip(xx_coords.ravel(), yy_coords.ravel())), grid_data.ravel())
        else:
            interp = LinearNDInterpolator(list(zip(xx_coords.ravel(), yy_coords.ravel())), grid_data.ravel(), fill_value=np.nan, rescale=True)

        # get bounding box from grid to create Euclidean raster
        (x_min, y_min, x_max, y_max) = grid.get_wgs_bbox()
        target_xx, target_yy = np.meshgrid(np.linspace(x_min, x_max, target_resolution_x), np.linspace(y_max, y_min, target_resolution_y))

        target_data = interp((target_xx, target_yy))
        target_data = RasterInterpolationService.expand_island(target_data, 1)

        no_data_value = -9999
        target_data[np.isnan(target_data)] = no_data_value

        return RasterData(
            xx_centers=target_xx.tolist(),
            yy_centers=target_yy.tolist(),
            bounds=(x_min, y_min, x_max, y_max),
            data=target_data.tolist(),
            nodata_value=no_data_value
        )

    @staticmethod
    def grid_data_to_grid_data_with_equal_cells(grid: Grid, data: IData, no_data_value: Any = None, target_resolution_x: int = 256,
                                                method: InterpolationMethod = InterpolationMethod.linear) -> list[list[float]]:
        # get grid coordinates
        xx_coords, yy_coords = grid.get_wgs_cell_center_coordinates()
        xx_coords = np.array(xx_coords)
        yy_coords = np.array(yy_coords)
        grid_data = np.array(data)
        grid_data = np.where(grid_data == no_data_value, np.nan, grid_data)

        # get grid bounds
        # keep aspect ratio
        aspect_ratio = grid.total_width / grid.total_height
        target_resolution_y = int(target_resolution_x / aspect_ratio)

        # create target grid
        target_xx = [np.linspace(xx_row[0], xx_row[-1], target_resolution_x) for xx_row in xx_coords]
        target_xx = np.array(target_xx)

        max_yys = yy_coords[0]
        min_yys = yy_coords[-1]
        target_yy = [np.linspace(min_yys[col], max_yys[col], target_resolution_y) for col in range(len(max_yys))]
        target_yy = np.array(target_yy)

        if isinstance(data, (int, float)):
            grid_data = np.ones_like(xx_coords) * data

        if method == InterpolationMethod.nearest:
            interp = NearestNDInterpolator(list(zip(xx_coords.ravel(), yy_coords.ravel())), grid_data.ravel())
        else:
            interp = LinearNDInterpolator(list(zip(xx_coords.ravel(), yy_coords.ravel())), grid_data.ravel(), fill_value=np.nan, rescale=True)

        target_data = interp((target_xx, target_yy))
        target_data = RasterInterpolationService.expand_island(target_data, 1)
        target_data[np.isnan(target_data)] = no_data_value

        return target_data.tolist()

    @staticmethod
    def grid_to_grid(
        source_grid: Grid,
        source_data: IData,
        target_grid: Grid,
        no_data_value: Any = None,
        method: InterpolationMethod = InterpolationMethod.linear
    ) -> list[list[float]]:

        # get source grid coordinates
        source_xx_coords, source_yy_coords = source_grid.get_wgs_cell_center_coordinates()
        source_xx_coords = np.array(source_xx_coords)
        source_yy_coords = np.array(source_yy_coords)

        # get target grid coordinates
        target_xx_coords, target_yy_coords = target_grid.get_wgs_cell_center_coordinates()
        target_xx_coords = np.array(target_xx_coords)
        target_yy_coords = np.array(target_yy_coords)

        source_data_array = np.array(source_data)
        if isinstance(source_data, (int, float)):
            source_data_array = np.ones_like(source_xx_coords) * float(source_data)

        source_data_array = np.where(source_data == no_data_value, np.nan, source_data_array)

        if method == InterpolationMethod.nearest:
            interp = NearestNDInterpolator(list(zip(source_xx_coords.ravel(), source_yy_coords.ravel())), source_data_array.ravel())
        else:
            interp = LinearNDInterpolator(list(zip(source_xx_coords.ravel(), source_yy_coords.ravel())), source_data_array.ravel(), fill_value=np.nan, rescale=False)

        target_data = interp((target_xx_coords, target_yy_coords))
        target_data = RasterInterpolationService.expand_island(target_data, 1)
        target_data = np.where(np.isnan(target_data), no_data_value, target_data)

        return target_data.tolist()
