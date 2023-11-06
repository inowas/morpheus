import json

from .SpatialDiscretization import AffectedCells, Grid, Point, Rotation, LengthUnit, Polygon, SpatialDiscretization


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


def test_grid_no_rotation() -> None:
    grid = Grid(
        x_coordinates=[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        y_coordinates=[0, 2000, 4000, 6000, 8000, 10000],
        rotation=Rotation.from_float(0.0),
        origin=Point(coordinates=(13.0, 51.0)),
        length_unit=LengthUnit.meters()
    )

    assert grid.to_dict() == {
        'x_coordinates': [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        'y_coordinates': [0, 2000, 4000, 6000, 8000, 10000],
        'rotation': 0.0,
        'origin': {
            'type': 'Point',
            'coordinates': (13.0, 51.0)
        },
        'length_unit': 'meters'
    }

    assert grid.nx() == 10
    assert grid.ny() == 5

    centers = grid.get_cell_centers()
    assert len(centers) == 5
    assert len(centers[0]) == 10
    assert grid.get_cell_centers()[4][9] == Point(coordinates=(13.085339951991354, 51.050851637405835))
    assert grid.get_cell_geometries()[4][9] == Polygon(coordinates=[[(13.080848375570756, 51.04520421011807),
                                                                     (13.08983152841195, 51.04520421011807),
                                                                     (13.08983152841195, 51.05649837612888),
                                                                     (13.080848375570756, 51.05649837612888),
                                                                     (13.080848375570756, 51.04520421011807)]])

    assert grid.get_grid_geometry() == Polygon(coordinates=[[(13.0, 51.0),
                                                             (13.08983152841195, 51.0),
                                                             (13.08983152841195, 51.05649837612888),
                                                             (13.0, 51.05649837612888),
                                                             (13.0, 51.0)
                                                             ]])


def test_grid_rotation_30deg() -> None:
    grid = Grid(
        x_coordinates=[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        y_coordinates=[0, 2000, 4000, 6000, 8000, 10000],
        rotation=Rotation.from_float(30.0),
        origin=Point(coordinates=(13.0, 51.0)),
        length_unit=LengthUnit.meters()
    )

    assert grid.to_dict() == {
        'x_coordinates': [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        'y_coordinates': [0, 2000, 4000, 6000, 8000, 10000],
        'rotation': 30.0,
        'origin': {
            'type': 'Point',
            'coordinates': (13.0, 51.0)
        },
        'length_unit': 'meters'
    }

    assert grid.nx() == 10
    assert grid.ny() == 5

    centers = grid.get_cell_centers()
    assert len(centers) == 5
    assert len(centers[0]) == 10
    assert grid.get_cell_centers()[4][9] == Point(coordinates=(13.033482378596881, 51.070861866169025))

    assert json.dumps(grid.get_grid_geometry(), default=lambda __o: __o.__dict__) == \
        ('{"coordinates": [['
         '[13.0, 51.0], [13.077796385665534, 51.02825779657566], [13.032880621459558, 51.07716100213936], '
            '[12.955084235794025, 51.04893302401866], [13.0, 51.0]]], "type": "Polygon"}')


def test_grid_from_area_0_degrees() -> None:
    grid = Grid.from_polygon(
        area=Polygon(coordinates=[[(13.0, 51.0), (13.0, 51.1), (13.1, 51.1), (13.1, 51.0), (13.0, 51.0)]]),
        rotation=Rotation.from_float(0.0),
        length_unit=LengthUnit.meters(),
        x_coordinates=[0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1],
        y_coordinates=[0, 0.20, 0.40, 0.60, 0.80, 1],
    )

    assert isinstance(grid, Grid) is True
    assert grid.to_dict() == {
        'x_coordinates': [0.0, 1113.1949079327285, 2226.389815865457, 3339.5847237981857, 4452.779631730914,
                          5565.974539663643, 6679.169447596371, 7792.364355529099, 8905.559263461828,
                          10018.754171394557, 11131.949079327285],
        'y_coordinates': [0.0, 3541.5882042292506, 7083.176408458501, 10624.764612687752, 14166.352816917002,
                          17707.941021146253],
        'rotation': 0.0,
        'origin': {
            'type': 'Point',
            'coordinates': (13.0, 51.0)
        },
        'length_unit': 'meters'
    }


def test_grid_from_area_45_degrees() -> None:
    grid = Grid.from_polygon(
        area=Polygon(coordinates=[[(13.0, 51.0), (13.0, 51.1), (13.1, 51.1), (13.1, 51.0), (13.0, 51.0)]]),
        rotation=Rotation.from_float(45),
        length_unit=LengthUnit.meters(),
        x_coordinates=[0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1],
        y_coordinates=[0, 0.20, 0.40, 0.60, 0.80, 1],
    )

    assert isinstance(grid, Grid) is True
    assert grid.to_dict() == {
        'x_coordinates': [0.0, 2039.2881858719513,
                          4078.5763717439027,
                          6117.864557615853,
                          8157.152743487805,
                          10196.440929359756,
                          12235.729115231707,
                          14275.017301103659,
                          16314.30548697561,
                          18353.59367284756,
                          20392.881858719513],
        'y_coordinates': [0.0,
                          4078.5763717439027,
                          8157.152743487805,
                          12235.729115231707,
                          16314.30548697561,
                          20392.881858719513],
        'rotation': 45,
        'origin': {
            'type': 'Point',
            'coordinates': (13.050000000000002, 50.96852330968296)
        },
        'length_unit': 'meters'
    }


def test_calculate_affected_cells() -> None:
    grid = Grid(
        x_coordinates=[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        y_coordinates=[0, 2000, 4000, 6000, 8000, 10000],
        rotation=Rotation.from_float(45),
        origin=Point(coordinates=(13.0, 51.0)),
        length_unit=LengthUnit.meters()
    )

    geometry = Polygon(coordinates=[
        [(13.0, 51.0), (13.08983152841195, 51.0), (13.08983152841195, 51.05649837612888), (13.0, 51.05649837612888),
         (13.0, 51.0)]
    ])

    spatial_discretization = SpatialDiscretization(geometry=geometry, affected_cells=None, grid=grid)
    assert spatial_discretization.affected_cells is None

    spatial_discretization = spatial_discretization.calculate_affected_cells()
    assert spatial_discretization.affected_cells is not None
