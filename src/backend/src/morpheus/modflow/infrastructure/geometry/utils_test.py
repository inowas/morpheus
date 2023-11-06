import json

from morpheus.modflow.infrastructure.geometry.utils import calculate_affected_cells, calculate_grid_cell_centers, \
    calculate_grid_geometry, calculate_grid_cell_geometries, grid_from_polygon
from morpheus.modflow.types.SpatialDiscretization import Grid, Rotation, LengthUnit, Point, Polygon


def test_calculate_affected_cells() -> None:
    grid = Grid(
        x_coordinates=[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        y_coordinates=[0, 2000, 4000, 6000, 8000, 10000],
        rotation=Rotation.from_float(45),
        origin=Point(coordinates=(13.0, 51.0)),
        length_unit=LengthUnit.meters()
    )

    geometry = Polygon(coordinates=[
        [(13.0, 51.0), (13.0898315284, 51.0), (13.0898315284, 51.0564983761), (13.0, 51.0564983761),
         (13.0, 51.0)]
    ])

    affected_cells = calculate_affected_cells(geometry=geometry, grid=grid)
    assert affected_cells is not None


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

    centers = calculate_grid_cell_centers(grid)

    assert len(centers) == 5
    assert len(centers[0]) == 10
    assert centers[4][9] == Point(coordinates=(13.08533995199, 51.05085163740))

    geometries = calculate_grid_cell_geometries(grid)
    assert geometries[4][9] == Polygon(coordinates=[[(13.08084837557, 51.0452042101),
                                                     (13.0898315284, 51.04520421011807),
                                                     (13.0898315284, 51.05649837612888),
                                                     (13.08084837557, 51.0564983761),
                                                     (13.08084837557, 51.0452042101)]])

    assert calculate_grid_geometry(grid) == Polygon(coordinates=[[(13.0, 51.0),
                                                                  (13.0898315284, 51.0),
                                                                  (13.0898315284, 51.0564983761),
                                                                  (13.0, 51.0564983761),
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

    centers = calculate_grid_cell_centers(grid)
    assert len(centers) == 5
    assert len(centers[0]) == 10
    assert centers[4][9] == Point(coordinates=(13.033482378596881, 51.070861866169025))

    assert json.dumps(calculate_grid_geometry(grid), default=lambda __o: __o.__dict__) == \
           ('{"coordinates": [['
            '[13.0, 51.0], [13.0777963857, 51.0282577966], [13.0328806215, 51.0771610021], '
            '[12.9550842358, 51.048933024], [13.0, 51.0]]], "type": "Polygon"}')


def test_grid_from_area_0_degrees() -> None:
    grid = grid_from_polygon(
        polygon=Polygon(coordinates=[[(13.0, 51.0), (13.0, 51.1), (13.1, 51.1), (13.1, 51.0), (13.0, 51.0)]]),
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
    grid = grid_from_polygon(
        polygon=Polygon(coordinates=[[(13.0, 51.0), (13.0, 51.1), (13.1, 51.1), (13.1, 51.0), (13.0, 51.0)]]),
        rotation=Rotation.from_float(45),
        length_unit=LengthUnit.meters(),
        x_coordinates=[0, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1],
        y_coordinates=[0, 0.20, 0.40, 0.60, 0.80, 1],
    )

    assert isinstance(grid, Grid) is True
    assert grid.to_dict() == {
        'x_coordinates': [0.0,
                          2039.2881858719513,
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
            'coordinates': (13.05, 50.9685233097)
        },
        'length_unit': 'meters'
    }
