from .GridCells import GridCells


def test_empty_grid_cells() -> None:
    shape = (2, 2)
    grid_cells = GridCells.empty_from_shape(nx=shape[0], ny=shape[1])
    assert shape == grid_cells.shape
    assert len(grid_cells.data) == 0
