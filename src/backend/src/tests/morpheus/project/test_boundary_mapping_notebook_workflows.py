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
