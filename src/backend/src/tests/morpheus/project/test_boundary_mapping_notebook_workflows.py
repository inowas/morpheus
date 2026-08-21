from datetime import datetime

import pytest

from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.ChdPackageMapper import calculate_chd_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.WelPackageMapper import calculate_wel_boundary_stress_period_data
from morpheus.project.types.boundaries.Boundary import BoundaryId, BoundaryName, BoundaryTags, ConstantHeadBoundary, WellBoundary
from morpheus.project.types.boundaries.ConstantHeadObservation import ConstantHeadObservation, ConstantHeadObservationValue, HeadValue
from morpheus.project.types.boundaries.Observation import ObservationId, ObservationName
from morpheus.project.types.boundaries.WellObservation import PumpingRate, WellObservation, WellObservationValue
from morpheus.project.types.discretization import SpatialDiscretization
from morpheus.project.types.discretization.spatial import ActiveCells, Grid, Rotation
from morpheus.project.types.discretization.time import TimeDiscretization
from morpheus.project.types.discretization.time.Stressperiods import (
    EndDateTime,
    IsSteadyState,
    NumberOfTimeSteps,
    StartDateTime,
    StressPeriod,
    StressPeriodCollection,
    TimeStepMultiplier,
)
from morpheus.project.types.discretization.time.TimeUnit import TimeUnit
from morpheus.project.types.geometry import LineString, Point
from morpheus.project.types.Model import Model

pytestmark = pytest.mark.unit


def _time_discretization():
    start = StartDateTime.from_datetime(datetime(2020, 1, 1))
    return TimeDiscretization(
        start_date_time=start,
        end_date_time=EndDateTime.from_datetime(datetime(2020, 1, 2)),
        stress_periods=StressPeriodCollection(
            [StressPeriod(start_date_time=start, number_of_time_steps=NumberOfTimeSteps(1), time_step_multiplier=TimeStepMultiplier(1), steady_state=IsSteadyState.yes())]
        ),
        time_unit=TimeUnit.days(),
    )


def _model_context(test_polygon):
    grid = Grid.cartesian_from_polygon(polygon=test_polygon, n_cols=10, n_rows=10, rotation=Rotation.from_float(0.0))
    spatial = SpatialDiscretization(geometry=test_polygon, grid=grid, affected_cells=ActiveCells.from_polygon(test_polygon, grid))
    model = Model.new()
    model = model.with_updated_spatial_discretization(spatial)
    model = model.with_updated_time_discretization(_time_discretization())
    return model, grid


def test_constant_head_notebook_maps_values_to_affected_cells(test_polygon):
    model, grid = _model_context(test_polygon)
    layer_id = model.layers[0].layer_id
    start = StartDateTime.from_datetime(datetime(2020, 1, 1))
    boundary_geometry = LineString(coordinates=[(13.9226, 50.9650), (13.9248, 50.9656)])
    observation = ConstantHeadObservation(
        observation_id=ObservationId.new(),
        observation_name=ObservationName.default(),
        geometry=Point(coordinates=boundary_geometry.coordinates[0]),
        data=[ConstantHeadObservationValue(date_time=start, head=HeadValue.from_float(100.0))],
    )
    boundary = ConstantHeadBoundary(
        id=BoundaryId.new(),
        type=ConstantHeadBoundary.type,
        name=BoundaryName('constant head'),
        interpolation='forward_fill',
        tags=BoundaryTags.empty(),
        geometry=boundary_geometry,
        affected_cells=ActiveCells.from_linestring(boundary_geometry, grid),
        affected_layers=[layer_id],
        observations=[observation],
    )

    result = calculate_chd_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert not result.is_empty()
    assert all(item.values == [100.0, 100.0] for item in result.data)
    assert all(item.layer == 0 for item in result.data)


def test_well_notebook_distributes_pumping_over_affected_layers(test_polygon):
    model, grid = _model_context(test_polygon)
    layer_ids = [model.layers[0].layer_id]
    start = StartDateTime.from_datetime(datetime(2020, 1, 1))
    geometry = Point(coordinates=(13.9235, 50.9655))
    observation = WellObservation(
        observation_id=ObservationId.new(),
        observation_name=ObservationName.default(),
        geometry=geometry,
        data=[WellObservationValue(date_time=start, pumping_rate=PumpingRate.from_float(-1000.0))],
    )
    boundary = WellBoundary(
        id=BoundaryId.new(),
        type=WellBoundary.type,
        name=BoundaryName('well'),
        interpolation='forward_fill',
        tags=BoundaryTags.empty(),
        geometry=geometry,
        affected_cells=ActiveCells.from_point(geometry, grid),
        affected_layers=layer_ids,
        observations=[observation],
    )

    result = calculate_wel_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert not result.is_empty()
    assert len(result.data) == 1
    assert result.data[0].values == [-1000.0]
    assert result.data[0].row >= 0
    assert result.data[0].column >= 0


def test_boundary_mapper_outputs_round_trip_through_stress_period_data():
    from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.StressPeriodData import StressPeriodData

    source = StressPeriodData()
    source.set_value(time_step=0, layer=1, row=2, column=3, values=[10.0, 20.0])
    source.set_value(time_step=1, layer=0, row=0, column=1, values=[30.0])

    restored = StressPeriodData.from_dict(source.to_dict())

    assert restored.to_dict() == source.to_dict()


def test_well_mapper_ignores_cells_outside_model(test_polygon):
    from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.WelPackageMapper import calculate_wel_boundary_stress_period_data
    from morpheus.project.types.discretization.spatial.ActiveCells import ActiveCell

    model, boundary = _model_with_well(pumping_rate=-100.0)
    boundary.affected_cells.data.append(ActiveCell(row=99, col=99))

    result = calculate_wel_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert len(result.data) == 1
    assert result.data[0].row < model.spatial_discretization.grid.n_rows()
    assert result.data[0].column < model.spatial_discretization.grid.n_cols()


def _model_with_well(pumping_rate):
    from datetime import datetime

    from morpheus.project.types.boundaries.Boundary import BoundaryId, BoundaryName, BoundaryTags, WellBoundary
    from morpheus.project.types.boundaries.Observation import ObservationId, ObservationName
    from morpheus.project.types.boundaries.WellObservation import PumpingRate, WellObservation, WellObservationValue
    from morpheus.project.types.discretization.spatial import ActiveCells
    from morpheus.project.types.discretization.time.Stressperiods import StartDateTime
    from morpheus.project.types.geometry import Point
    from morpheus.project.types.Model import Model

    model = Model.new()
    model = model.with_updated_spatial_discretization(
        model.spatial_discretization.with_updated_affected_cells(ActiveCells.from_polygon(model.spatial_discretization.geometry, model.spatial_discretization.grid))
    )
    geometry = Point(coordinates=(0.5, 0.5))
    start = StartDateTime.from_datetime(datetime(2020, 1, 1))
    observation = WellObservation(
        observation_id=ObservationId.new(),
        observation_name=ObservationName.default(),
        geometry=geometry,
        data=[WellObservationValue(date_time=start, pumping_rate=PumpingRate.from_float(pumping_rate))],
    )
    boundary = WellBoundary(
        id=BoundaryId.new(),
        type=WellBoundary.type,
        name=BoundaryName('well'),
        interpolation='forward_fill',
        tags=BoundaryTags.empty(),
        geometry=geometry,
        affected_cells=ActiveCells.from_point(geometry, model.spatial_discretization.grid),
        affected_layers=[model.layers[0].layer_id],
        observations=[observation],
    )
    return model.with_updated_boundaries(model.boundaries.with_added_boundary(boundary)), boundary
