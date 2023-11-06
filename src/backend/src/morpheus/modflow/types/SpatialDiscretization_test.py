from .SpatialDiscretization import AffectedCells


def test_affected_cells_are_equal() -> None:
    data = [[[True, False], [False, True]], [[True, False], [False, True]]]
    shape = (2, 2, 2)
    affected_cells = AffectedCells(data=data, shape=shape)
    assert data == affected_cells.data
    assert shape == affected_cells.shape

    assert affected_cells.to_string() == {
        'shape': shape,
        'data': '10011001'
    }
