import dataclasses
from typing import Literal, Any, Sequence

import numpy as np
from scipy.interpolate import LinearNDInterpolator, NearestNDInterpolator


@dataclasses.dataclass
class RasterCoordinates:
    xx_coords: list[list[float]]
    yy_coords: list[list[float]]


@dataclasses.dataclass
class RasterData:
    data: Sequence[Sequence[float | None]]

    def __getitem__(self, item):
        return self.data[item]

    def __len__(self):
        return len(self.data)

    def __iter__(self):
        return iter(self.data)


@dataclasses.dataclass
class Raster:
    coords: RasterCoordinates
    data: RasterData


class RasterInterpolationService:
    @staticmethod
    def interpolate_raster(raster: Raster, new_coords: RasterCoordinates, method: Literal['linear', 'nearest'] = 'linear', fill_value: Any = None) -> Raster:
        raster_xx = np.array(raster.coords.xx_coords)
        raster_yy = np.array(raster.coords.yy_coords)
        raster_data = np.array(raster.data.data)

        if method == 'nearest':
            interp = NearestNDInterpolator(list(zip(raster_xx.ravel(), raster_yy.ravel())), raster_data.ravel())
        else:
            interp = LinearNDInterpolator(list(zip(raster_xx.ravel(), raster_yy.ravel())), raster_data.ravel(), fill_value=np.nan, rescale=True)

        new_raster_xx = np.array(new_coords.xx_coords)
        new_raster_yy = np.array(new_coords.yy_coords)
        grid_data = interp((new_raster_xx, new_raster_yy)).tolist()

        for i, row in enumerate(grid_data):
            for j, value in enumerate(row):
                if np.isnan(value):
                    grid_data[i][j] = fill_value

        return Raster(coords=new_coords, data=RasterData(data=grid_data.tolist()))
