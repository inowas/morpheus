from .GridCells import GridCells


def test_affected_cells_are_equal() -> None:
    data = [[[True, False], [False, True]], [[True, False], [False, True]]]
    shape = (2, 2, 2)
    grid_cells = GridCells(data=data, shape=shape)
    assert data == grid_cells.data
    assert shape == grid_cells.shape

    assert grid_cells.to_string() == {
        'shape': shape,
        'data': '10011001'
    }
