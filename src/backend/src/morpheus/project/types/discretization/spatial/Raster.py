import dataclasses


@dataclasses.dataclass
class RasterCoordinates:
    xx_coords: list[list[float]]
    yy_coords: list[list[float]]


class RasterData:
    _data: list[list[float]]
    _nodata_value: float

    def __init__(self, data: list[list[float]], nodata_value: float = -9999):
        self._data = data
        self._nodata_value = nodata_value

    def __getitem__(self, key):
        return self._data[key]

    def __setitem__(self, key, value):
        self._data[key] = value

    def __iter__(self):
        return iter(self._data)

    def get_data(self):
        return self._data

    def get_nodata_value(self):
        return self._nodata_value


@dataclasses.dataclass
class Raster:
    coords: RasterCoordinates
    data: RasterData

    def get_data(self):
        return self.data.get_data()