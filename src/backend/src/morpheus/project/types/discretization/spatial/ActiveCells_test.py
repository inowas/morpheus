from .ActiveCells import ActiveCells


def test_empty_grid_cells() -> None:
    nx = 10
    ny = 5
    shape = (ny, nx)
    grid_cells = ActiveCells.empty_from_shape(n_cols=nx, n_rows=ny)
    assert shape == grid_cells.shape
    assert len(grid_cells.data) == 0


def test_grid_cells_to_sparse_dict() -> None:
    grid_cells = ActiveCells.empty_from_shape(n_cols=100, n_rows=20)
    grid_cells.set_active(col=0, row=0)
    grid_cells.set_active(col=1, row=1)
    assert grid_cells.to_dict(as_raster=False) == {
        'type': 'sparse',
        'shape': (20, 100),
        'data': [(0, 0), (1, 1)]
    }


def test_grid_cells_to_raster_dict() -> None:
    grid_cells = ActiveCells.empty_from_shape(n_cols=2, n_rows=4)
    grid_cells.set_active(col=0, row=0)
    grid_cells.set_active(col=0, row=1)
    grid_cells.set_active(col=1, row=1)
    assert grid_cells.to_dict(as_raster=True) == {
        'type': 'raster',
        'shape': (4, 2),
        'empty_value': False,
        'data': [[True, False], [True, True], [False, False], [False, False]]
    }


def test_grid_cells_to_sparse_inverse_dict() -> None:
    grid_cells = ActiveCells.empty_from_shape(n_cols=2, n_rows=5)
    grid_cells.set_active(col=0, row=0)
    grid_cells.set_active(col=0, row=1)
    grid_cells.set_active(col=0, row=2)
    grid_cells.set_active(col=0, row=3)
    grid_cells.set_active(col=0, row=4)
    grid_cells.set_active(col=1, row=1)
    grid_cells.set_active(col=1, row=2)
    grid_cells.set_active(col=1, row=3)
    grid_cells.set_active(col=1, row=4)

    assert grid_cells.to_dict() == {
        'type': 'sparse_inverse',
        'shape': (5, 2),
        'data': [(1, 0)]
    }

    assert ActiveCells.from_dict({
        'type': 'sparse_inverse',
        'shape': (5, 2),
        'data': [(1, 0)]
    }) == grid_cells


def test_grid_cells_from_dict() -> None:
    grid_cells = ActiveCells.empty_from_shape(n_cols=2, n_rows=4)
    grid_cells.set_active(col=0, row=0)
    grid_cells.set_active(col=1, row=1)
    assert ActiveCells.from_dict({
        'type': 'sparse',
        'shape': (4, 2),
        'data': [(0, 0), (1, 1)]
    }) == grid_cells

    assert ActiveCells.from_dict({
        'type': 'raster',
        'shape': (4, 2),
        'empty_value': False,
        'data': [[True, False], [False, True], [False, False], [False, False]]
    }) == grid_cells


def test_grid_cells_convert_to_raster() -> None:
    grid_cells = ActiveCells.empty_from_shape(n_cols=15, n_rows=5)
    grid_cells.set_active(col=0, row=0)
    grid_cells.set_active(col=14, row=0)
    grid_cells.set_active(col=0, row=4)
    grid_cells.set_active(col=14, row=4)
    grid_cells.set_active(col=7, row=2)

    assert grid_cells.to_dict(as_raster=True) == {
        'type': 'raster',
        'shape': (5, 15),
        'empty_value': False,
        'data': [
            [True, False, False, False, False, False, False, False, False, False, False, False, False, False, True],
            [False, False, False, False, False, False, False, False, False, False, False, False, False, False, False],
            [False, False, False, False, False, False, False, True, False, False, False, False, False, False, False],
            [False, False, False, False, False, False, False, False, False, False, False, False, False, False, False],
            [True, False, False, False, False, False, False, False, False, False, False, False, False, False, True],
        ]
    }


def test_grid_cells_autodetect() -> None:
    grid_cells = ActiveCells.empty_from_shape(n_cols=15, n_rows=5)
    grid_cells.set_active(col=0, row=0)
    grid_cells.set_active(col=14, row=0)
    grid_cells.set_active(col=0, row=4)
    grid_cells.set_active(col=14, row=4)
    grid_cells.set_active(col=7, row=2)

    assert grid_cells.to_dict(auto_detect=True)['type'] == 'sparse'

    grid_cells = ActiveCells.empty_from_shape(n_cols=2, n_rows=3)
    grid_cells.set_active(col=0, row=0)
    grid_cells.set_active(col=1, row=1)
    grid_cells.set_active(col=0, row=2)
    grid_cells.set_active(col=1, row=2)

    assert grid_cells.to_dict(auto_detect=True)['type'] == 'raster'

    grid_cells = ActiveCells.empty_from_shape(n_cols=2, n_rows=5)
    grid_cells.set_active(col=0, row=0)
    grid_cells.set_active(col=0, row=1)
    grid_cells.set_active(col=0, row=2)
    grid_cells.set_active(col=0, row=3)
    grid_cells.set_active(col=0, row=4)
    grid_cells.set_active(col=1, row=1)
    grid_cells.set_active(col=1, row=2)
    grid_cells.set_active(col=1, row=3)
    grid_cells.set_active(col=1, row=4)

    assert grid_cells.to_dict(auto_detect=True)['type'] == 'sparse_inverse'


def test_grid_cells_filter() -> None:
    boundary_cells = ActiveCells.empty_from_shape(n_cols=15, n_rows=5)
    boundary_cells.set_active(col=0, row=0)
    boundary_cells.set_active(col=0, row=1)
    boundary_cells.set_active(col=0, row=2)
    boundary_cells.set_active(col=0, row=3)
    boundary_cells.set_active(col=0, row=4)

    model_cells = ActiveCells.empty_from_shape(n_cols=15, n_rows=5)
    model_cells.set_active(col=0, row=1)
    model_cells.set_active(col=0, row=2)
    model_cells.set_active(col=0, row=3)
    model_cells.set_active(col=0, row=4)

    boundary_cells_filtered = boundary_cells.filter(lambda cell: model_cells.contains(cell))
    assert boundary_cells_filtered.to_dict(auto_detect=True) == {
        'type': 'sparse',
        'shape': (5, 15),
        'data': [(0, 1), (0, 2), (0, 3), (0, 4)]
    }
