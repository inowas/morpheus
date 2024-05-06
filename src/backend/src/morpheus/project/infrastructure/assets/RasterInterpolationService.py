from enum import StrEnum
from typing import Any

import numpy as np
from scipy.interpolate import LinearNDInterpolator, NearestNDInterpolator

from morpheus.project.types.discretization.spatial import Grid
from morpheus.project.types.discretization.spatial.Raster import Raster, RasterCoordinates, RasterData

IData = list[list[float | None]] | list[list[float]] | float


class InterpolationMethod(StrEnum):
    linear = 'linear'
    nearest = 'nearest'

    @classmethod
    def _missing_(cls, value):
        return cls.linear


class RasterInterpolationService:
    @staticmethod
    def raster_to_raster(raster: Raster, new_coords: RasterCoordinates, method: InterpolationMethod = InterpolationMethod.linear, nodata_value: float = -9999) -> Raster:
        raster_xx = np.array(raster.coords.xx_coords)
        raster_yy = np.array(raster.coords.yy_coords)
        raster_data = np.array(raster.data.get_data())
        raster_data = np.where(raster_data == nodata_value, np.nan, raster_data)

        try:
            if method == InterpolationMethod.nearest:
                interp = NearestNDInterpolator(list(zip(raster_xx.ravel(), raster_yy.ravel())), raster_data.ravel())
            else:
                interp = LinearNDInterpolator(list(zip(raster_xx.ravel(), raster_yy.ravel())), raster_data.ravel(), fill_value=np.nan, rescale=True)
        except Exception as e:
            raise ValueError(f'Failed to interpolate raster: {e}')

        new_raster_xx = np.array(new_coords.xx_coords)
        new_raster_yy = np.array(new_coords.yy_coords)
        grid_data = interp((new_raster_xx, new_raster_yy))
        grid_data = np.where(np.isnan(grid_data), nodata_value, grid_data)

        return Raster(coords=new_coords, data=RasterData(data=grid_data.tolist(), nodata_value=nodata_value))

    @staticmethod
    def grid_data_to_raster_data(grid: Grid, data: IData, nodata_value: Any = None, target_resolution_x: int = 256,
                                 method: InterpolationMethod = InterpolationMethod.linear) -> Raster:
        # get grid coordinates
        xx_coords, yy_coords = grid.get_wgs_coordinates()
        xx_coords = np.array(xx_coords)
        yy_coords = np.array(yy_coords)

        # keep aspect ratio
        aspect_ratio = grid.bbox_aspect_ratio()
        target_resolution_y = int(target_resolution_x / aspect_ratio)

        # get grid bounds and create target grid
        (x_min, y_min), (x_max, y_max) = grid.bbox()
        target_xx, target_yy = np.meshgrid(np.linspace(x_min, x_max, target_resolution_x), np.linspace(y_max, y_min, target_resolution_y))

        grid_data = np.array(data)
        grid_data = np.where(grid_data == nodata_value, np.nan, grid_data)

        if isinstance(data, (int, float)):
            grid_data = np.ones_like(xx_coords) * data

        if method == InterpolationMethod.nearest:
            interp = NearestNDInterpolator(list(zip(xx_coords.ravel(), yy_coords.ravel())), grid_data.ravel())
        else:
            interp = LinearNDInterpolator(list(zip(xx_coords.ravel(), yy_coords.ravel())), grid_data.ravel(), fill_value=np.nan, rescale=True)

        target_data = interp((target_xx, target_yy))

        no_data_value = -9999
        target_data = np.where(np.isnan(target_data), -9999, target_data)

        return Raster(
            coords=RasterCoordinates(xx_coords=target_xx.tolist(), yy_coords=target_yy.tolist()),
            data=RasterData(data=target_data.tolist(), nodata_value=no_data_value),
        )

    @staticmethod
    def grid_data_to_grid_data_with_equal_cells(grid: Grid, data: IData, nodata_value: Any = None, target_resolution_x: int = 256,
                                                method: InterpolationMethod = InterpolationMethod.linear) -> Raster:
        # get grid coordinates
        xx_coords, yy_coords = grid.get_wgs_coordinates()
        xx_coords = np.array(xx_coords)
        yy_coords = np.array(yy_coords)

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

        grid_data = np.array(data)
        grid_data = np.where(grid_data == nodata_value, np.nan, grid_data)

        if isinstance(data, (int, float)):
            grid_data = np.ones_like(xx_coords) * data

        if method == InterpolationMethod.nearest:
            interp = NearestNDInterpolator(list(zip(xx_coords.ravel(), yy_coords.ravel())), grid_data.ravel())
        else:
            interp = LinearNDInterpolator(list(zip(xx_coords.ravel(), yy_coords.ravel())), grid_data.ravel(), fill_value=np.nan, rescale=True)

        target_data = interp((target_xx, target_yy))

        no_data_value = -9999
        target_data = np.where(np.isnan(target_data), -9999, target_data)

        return Raster(coords=RasterCoordinates(xx_coords=target_xx.tolist(), yy_coords=target_yy.tolist()), data=RasterData(data=target_data.tolist(), nodata_value=no_data_value))

    @staticmethod
    def grid_to_grid(source_grid: Grid, source_data: IData, target_grid: Grid, nodata_value: Any = None, method: InterpolationMethod = InterpolationMethod.linear) -> Raster:

        # get source grid coordinates
        source_xx_coords, source_yy_coords = source_grid.get_wgs_coordinates()
        source_xx_coords = np.array(source_xx_coords)
        source_yy_coords = np.array(source_yy_coords)

        # get target grid coordinates
        target_xx_coords, target_yy_coords = target_grid.get_wgs_coordinates()
        target_xx_coords = np.array(target_xx_coords)
        target_yy_coords = np.array(target_yy_coords)

        source_data_array = np.array(source_data)
        if isinstance(source_data, (int, float)):
            source_data_array = np.ones_like(source_xx_coords) * float(source_data)

        source_data_array = np.where(source_data == nodata_value, np.nan, source_data_array)

        if method == InterpolationMethod.nearest:
            interp = NearestNDInterpolator(list(zip(source_xx_coords.ravel(), source_yy_coords.ravel())), source_data_array.ravel())
        else:
            interp = LinearNDInterpolator(list(zip(source_xx_coords.ravel(), source_yy_coords.ravel())), source_data_array.ravel(), fill_value=np.nan, rescale=True)

        target_data = interp((target_xx_coords, target_yy_coords))

        no_data_value = -9999
        target_data = np.where(np.isnan(target_data), -9999, target_data)

        return Raster(
            coords=RasterCoordinates(xx_coords=target_xx_coords.tolist(), yy_coords=target_yy_coords.tolist()),
            data=RasterData(data=target_data.tolist(), nodata_value=no_data_value)
        )
