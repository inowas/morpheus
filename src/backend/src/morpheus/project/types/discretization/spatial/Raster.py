import dataclasses


@dataclasses.dataclass
class RasterCoordinates:
    xx_coords: list[list[float]]
    yy_coords: list[list[float]]

    def euclidean_distance(self, x_idx1, y_idx1, x_idx2, y_idx2):
        x1 = self.xx_coords[x_idx1][y_idx1]
        y1 = self.yy_coords[x_idx1][y_idx1]
        x2 = self.xx_coords[x_idx2][y_idx2]
        y2 = self.yy_coords[x_idx2][y_idx2]
        return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5


class RasterData:
    _data: list[list[float]]
    _nodata_value: float

    def __init__(self, data: list[list[float]], nodata_value: float = -9999.0):
        self._data = data
        self._nodata_value = float(nodata_value)

    def __getitem__(self, key):
        return self._data[key]

    def __setitem__(self, key, value):
        self._data[key] = value

    def __iter__(self):
        return iter(self._data)

    def get_data(self):
        return self._data

    def get_min_value(self):
        no_data_value = self.get_nodata_value()
        return min([min([value for value in row if value != no_data_value]) for row in self._data], default=no_data_value)

    def get_max_value(self):
        no_data_value = self.get_nodata_value()
        return max([max([value for value in row if value != no_data_value]) for row in self._data], default=no_data_value)

    def get_nodata_value(self):
        return self._nodata_value


@dataclasses.dataclass
class Raster:
    coords: RasterCoordinates
    data: RasterData

    def get_data(self) -> list[list[float]]:
        return self.data.get_data()

    def get_nodata_value(self) -> float:
        return self.data.get_nodata_value()

    def get_min_value(self) -> float:
        return self.data.get_min_value()

    def get_max_value(self) -> float:
        return self.data.get_max_value()

    def get_n_cols(self) -> int:
        return len(self.data.get_data()[0])

    def get_n_rows(self) -> int:
        return len(self.data.get_data())

    def get_cell_size_x(self) -> float:
        return self.coords.euclidean_distance(0, 0, 0, 1)

    def get_cell_size_y(self) -> float:
        return self.coords.euclidean_distance(0, 0, 1, 0)
