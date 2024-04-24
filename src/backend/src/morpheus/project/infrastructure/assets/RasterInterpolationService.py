from typing import Literal

import numpy as np
from scipy.interpolate import LinearNDInterpolator, NearestNDInterpolator

from morpheus.project.types.discretization.spatial.Raster import Raster, RasterCoordinates, RasterData


class RasterInterpolationService:
    @staticmethod
    def interpolate_raster(raster: Raster, new_coords: RasterCoordinates, method: Literal['linear', 'nearest'] = 'linear', nodata_value: float = -9999) -> Raster:
        raster_xx = np.array(raster.coords.xx_coords)
        raster_yy = np.array(raster.coords.yy_coords)
        raster_data = np.array(raster.data.get_data())
        raster_data = np.where(raster_data == nodata_value, np.nan, raster_data)

        if method == 'nearest':
            interp = NearestNDInterpolator(list(zip(raster_xx.ravel(), raster_yy.ravel())), raster_data.ravel())
        else:
            interp = LinearNDInterpolator(list(zip(raster_xx.ravel(), raster_yy.ravel())), raster_data.ravel(), fill_value=np.nan, rescale=True)

        new_raster_xx = np.array(new_coords.xx_coords)
        new_raster_yy = np.array(new_coords.yy_coords)
        grid_data = interp((new_raster_xx, new_raster_yy))
        grid_data = np.where(np.isnan(grid_data), nodata_value, grid_data)

        return Raster(coords=new_coords, data=RasterData(data=grid_data.tolist(), nodata_value=nodata_value))
