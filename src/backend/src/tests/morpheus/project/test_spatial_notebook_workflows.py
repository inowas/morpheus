import pytest

from morpheus.project.types.discretization.spatial import ActiveCells, Grid, Rotation
from morpheus.project.types.geometry import Point

pytestmark = pytest.mark.unit


def test_spatial_discretization_notebook_creates_requested_grid(test_polygon):
    grid = Grid.cartesian_from_polygon(polygon=test_polygon, n_cols=20, n_rows=10, rotation=Rotation.from_float(0.0))

    assert grid.n_cols() == 20
    assert grid.n_rows() == 10
    assert len(grid.get_wgs_cell_centers()) == 10
    assert len(grid.get_wgs_cell_centers()[0]) == 20
    assert len(grid.get_wgs_cell_geometries()) == 10
    assert len(grid.get_wgs_cell_geometries()[0]) == 20


def test_spatial_discretization_notebook_supports_rotated_grids(test_polygon):
    grid = Grid.cartesian_from_polygon(polygon=test_polygon, n_cols=20, n_rows=20, rotation=Rotation.from_float(30.0))

    assert grid.rotation.to_float() == 30.0
    assert grid.n_cols() == 20
    assert grid.n_rows() == 20
    assert grid.get_wgs_bbox()[0] < grid.get_wgs_bbox()[2]
    assert grid.get_wgs_bbox()[1] < grid.get_wgs_bbox()[3]


def test_active_cells_notebook_maps_point_to_one_grid_cell(test_polygon):
    grid = Grid.cartesian_from_polygon(polygon=test_polygon, n_cols=10, n_rows=10, rotation=Rotation.from_float(0.0))
    point = grid.get_wgs_cell_centers()[4][6]

    cells = ActiveCells.from_point(point=point, grid=grid)

    assert cells.shape == (10, 10)
    assert len(cells) == 1
    assert cells.is_active(row=4, col=6)


def test_active_cells_notebook_uses_polygon_centers(test_polygon):
    grid = Grid.cartesian_from_polygon(polygon=test_polygon, n_cols=10, n_rows=10, rotation=Rotation.from_float(0.0))

    cells = ActiveCells.from_polygon(polygon=test_polygon, grid=grid)

    assert cells.shape == (10, 10)
    assert len(cells) > 0
    assert len(cells) <= 100


def test_active_cells_rejects_point_outside_grid(test_polygon):
    grid = Grid.cartesian_from_polygon(polygon=test_polygon, n_cols=10, n_rows=10, rotation=Rotation.from_float(0.0))

    with pytest.raises(ValueError, match='not contained in any grid cell'):
        ActiveCells.from_point(point=Point(coordinates=(0.0, 0.0)), grid=grid)


def test_grid_rejects_invalid_relative_coordinates(test_polygon):
    with pytest.raises(ValueError, match='percentages must start with 0'):
        Grid.from_polygon_with_relative_coordinates(
            polygon=test_polygon,
            rotation=Rotation.from_float(0.0),
            relative_col_coordinates=[0.1, 1.0],
            relative_row_coordinates=[0.0, 1.0],
        )
