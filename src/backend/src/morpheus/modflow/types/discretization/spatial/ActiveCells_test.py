from .ActiveCells import ActiveCells


def test_empty_grid_cells() -> None:
    nx = 10
    ny = 5
    shape = (ny, nx)
    grid_cells = ActiveCells.empty_from_shape(nx=nx, ny=ny)
    assert shape == grid_cells.shape
    assert len(grid_cells.data) == 0


def test_grid_cells_to_sparse_dict() -> None:
    grid_cells = ActiveCells.empty_from_shape(nx=100, ny=20)
    grid_cells.set_active(x=0, y=0)
    grid_cells.set_active(x=1, y=1)
    assert grid_cells.to_dict(as_raster=False) == {
        'type': 'sparse',
        'shape': (20, 100),
        'data': [(0, 0), (1, 1)]
    }


def test_grid_cells_to_raster_dict() -> None:
    grid_cells = ActiveCells.empty_from_shape(nx=2, ny=4)
    grid_cells.set_active(x=0, y=0)
    grid_cells.set_active(x=0, y=1)
    grid_cells.set_active(x=1, y=1)
    assert grid_cells.to_dict(as_raster=True) == {
        'type': 'raster',
        'shape': (4, 2),
        'empty_value': False,
        'data': [[True, False], [True, True], [False, False], [False, False]]
    }


def test_grid_cells_to_sparse_inverted_dict() -> None:
    grid_cells = ActiveCells.empty_from_shape(nx=2, ny=5)
    grid_cells.set_active(x=0, y=0)
    grid_cells.set_active(x=0, y=1)
    grid_cells.set_active(x=0, y=2)
    grid_cells.set_active(x=0, y=3)
    grid_cells.set_active(x=0, y=4)
    grid_cells.set_active(x=1, y=1)
    grid_cells.set_active(x=1, y=2)
    grid_cells.set_active(x=1, y=3)
    grid_cells.set_active(x=1, y=4)

    assert grid_cells.to_dict() == {
        'type': 'sparse_inverted',
        'shape': (5, 2),
        'data': [(1, 0)]
    }

    assert ActiveCells.from_dict({
        'type': 'sparse_inverted',
        'shape': (5, 2),
        'data': [(1, 0)]
    }) == grid_cells


def test_grid_cells_from_dict() -> None:
    grid_cells = ActiveCells.empty_from_shape(nx=2, ny=4)
    grid_cells.set_active(x=0, y=0)
    grid_cells.set_active(x=1, y=1)
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
    grid_cells = ActiveCells.empty_from_shape(nx=15, ny=5)
    grid_cells.set_active(x=0, y=0)
    grid_cells.set_active(x=14, y=0)
    grid_cells.set_active(x=0, y=4)
    grid_cells.set_active(x=14, y=4)
    grid_cells.set_active(x=7, y=2)

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
    grid_cells = ActiveCells.empty_from_shape(nx=15, ny=5)
    grid_cells.set_active(x=0, y=0)
    grid_cells.set_active(x=14, y=0)
    grid_cells.set_active(x=0, y=4)
    grid_cells.set_active(x=14, y=4)
    grid_cells.set_active(x=7, y=2)

    assert grid_cells.to_dict(auto_detect=True)['type'] == 'sparse'

    grid_cells = ActiveCells.empty_from_shape(nx=2, ny=3)
    grid_cells.set_active(x=0, y=0)
    grid_cells.set_active(x=1, y=1)
    grid_cells.set_active(x=0, y=2)
    grid_cells.set_active(x=1, y=2)

    assert grid_cells.to_dict(auto_detect=True)['type'] == 'raster'

    grid_cells = ActiveCells.empty_from_shape(nx=2, ny=5)
    grid_cells.set_active(x=0, y=0)
    grid_cells.set_active(x=0, y=1)
    grid_cells.set_active(x=0, y=2)
    grid_cells.set_active(x=0, y=3)
    grid_cells.set_active(x=0, y=4)
    grid_cells.set_active(x=1, y=1)
    grid_cells.set_active(x=1, y=2)
    grid_cells.set_active(x=1, y=3)
    grid_cells.set_active(x=1, y=4)

    assert grid_cells.to_dict(auto_detect=True)['type'] == 'sparse_inverted'
