import numpy as np
import pytest

from morpheus.project.infrastructure.assets.RasterInterpolationService import InterpolationMethod, RasterData, RasterInterpolationService
from morpheus.project.types.discretization.spatial import Grid, Rotation

pytestmark = pytest.mark.unit


def test_raster_notebook_expands_a_single_valid_value():
    data = np.full((3, 3), np.nan)
    data[1, 1] = 5.0

    result = RasterInterpolationService.expand_island(data, iterations=1)

    assert np.all(result == 5.0)


def test_raster_notebook_resamples_constant_grid_data(test_polygon):
    grid = Grid.cartesian_from_polygon(polygon=test_polygon, n_cols=4, n_rows=2, rotation=Rotation.from_float(0.0))

    result = RasterInterpolationService.grid_data_to_grid_data_with_equal_cells(
        grid=grid,
        data=7.0,
        target_resolution_x=8,
        no_data_value=-9999.0,
    )

    assert len(result) > 0
    assert len(result[0]) == 8
    values = [value for row in result for value in row if value != -9999.0]
    assert values
    assert all(value == 7.0 for value in values)


def test_raster_notebook_interpolates_raster_values_to_model_grid(test_polygon):
    grid = Grid.cartesian_from_polygon(polygon=test_polygon, n_cols=4, n_rows=2, rotation=Rotation.from_float(0.0))
    x_min, y_min, x_max, y_max = grid.get_wgs_bbox()
    x = np.linspace(x_min, x_max, 5)
    y = np.linspace(y_min, y_max, 5)
    xx, yy = np.meshgrid(x, y)
    raster = RasterData(
        xx_centers=xx.tolist(),
        yy_centers=yy.tolist(),
        bounds=(x_min, y_min, x_max, y_max),
        data=(xx + yy).tolist(),
        nodata_value=-9999.0,
    )

    result, no_data_value = RasterInterpolationService.raster_data_to_grid_data(
        raster_data=raster,
        grid=grid,
        method=InterpolationMethod.linear,
        no_data_value=-9999.0,
    )

    assert len(result) == 2
    assert len(result[0]) == 4
    assert no_data_value == -9999.0
    assert all(value != no_data_value for row in result for value in row)
