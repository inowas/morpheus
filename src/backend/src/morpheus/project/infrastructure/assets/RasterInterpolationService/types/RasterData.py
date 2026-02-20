import dataclasses

import numpy as np


@dataclasses.dataclass
class RasterData:
    _xx_centers: list[list[float]]
    _yy_centers: list[list[float]]
    _bounds: tuple[float, float, float, float]
    _data: list[list[float]]
    _nodata_value: float

    def __init__(
        self, xx_centers: list[list[float]], yy_centers: list[list[float]], bounds: tuple[float, float, float, float], data: list[list[float]], nodata_value: float = -9999.0
    ):
        self._xx_centers = xx_centers
        self._yy_centers = yy_centers
        self._bounds = bounds
        self._data = data
        self._nodata_value = nodata_value

    def get_xx_centers(self) -> list[list[float]]:
        return self._xx_centers

    def get_yy_centers(self) -> list[list[float]]:
        return self._yy_centers

    def get_data(self) -> list[list[float]]:
        return self._data

    def get_nodata_value(self) -> float:
        return self._nodata_value

    def get_min_value(self) -> float:
        min_value = np.inf
        for row in self._data:
            for value in row:
                if value != self._nodata_value and value < min_value:
                    min_value = value
        return min_value

    def get_max_value(self) -> float:
        max_value = -np.inf
        for row in self._data:
            for value in row:
                if value != self._nodata_value and value > max_value:
                    max_value = value
        return max_value

    def get_n_cols(self) -> int:
        return len(self._data[0])

    def get_n_rows(self) -> int:
        return len(self._data)

    def get_mean_cell_size_x(self) -> float:
        return self._bounds[2] - self._bounds[0] / self.get_n_cols()

    def get_mean_cell_size_y(self) -> float:
        return self._bounds[3] - self._bounds[1] / self.get_n_rows()

    def get_bounds(self) -> tuple[float, float, float, float]:
        return self._bounds

    def get_xll_corner(self) -> float:
        return self._bounds[0]

    def get_yll_corner(self) -> float:
        return self._bounds[1]
