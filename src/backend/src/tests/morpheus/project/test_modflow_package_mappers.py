from datetime import datetime

import pytest

from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.ChdPackageMapper import calculate_chd_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.DrnPackageMapper import calculate_drn_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.EvtPackageMapper import calculate_evt_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.FhbPackageMapper import calculate_fhb_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.GhbPackageMapper import calculate_ghb_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.HobPackageMapper import calculate_observation_items
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.LakPackageMapper import calculate_lak_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.RchPackageMapper import calculate_rch_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.RivPackageMapper import calculate_riv_boundary_stress_period_data
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.WelPackageMapper import calculate_wel_boundary_stress_period_data
from morpheus.project.types.boundaries.Boundary import BoundaryId, BoundaryType
from morpheus.project.types.boundaries.BoundaryFactory import BoundaryFactory
from morpheus.project.types.boundaries.ConstantHeadObservation import ConstantHeadObservationValue, HeadValue
from morpheus.project.types.boundaries.DrainObservation import Conductance as DrainConductance
from morpheus.project.types.boundaries.DrainObservation import DrainRawDataItem
from morpheus.project.types.boundaries.DrainObservation import Stage as DrainStage
from morpheus.project.types.boundaries.EvapotranspirationObservation import Evapotranspiration, EvapotranspirationObservationValue, ExtinctionDepth, SurfaceElevation
from morpheus.project.types.boundaries.FlowAndHeadObservation import Flow, FlowAndHeadRawDataItem
from morpheus.project.types.boundaries.FlowAndHeadObservation import Head as FlowAndHead
from morpheus.project.types.boundaries.GeneralHeadObservation import Conductance as GeneralHeadConductance
from morpheus.project.types.boundaries.GeneralHeadObservation import GeneralHeadRawDataItem
from morpheus.project.types.boundaries.GeneralHeadObservation import Stage as GeneralHeadStage
from morpheus.project.types.boundaries.LakeObservation import Evaporation, LakeObservationValue, Precipitation, Runoff, Withdrawal
from morpheus.project.types.boundaries.RechargeObservation import RechargeObservationValue, RechargeRate
from morpheus.project.types.boundaries.RiverObservation import Conductance as RiverConductance
from morpheus.project.types.boundaries.RiverObservation import RiverbedBottom, RiverObservationValue, RiverStage
from morpheus.project.types.boundaries.WellObservation import PumpingRate, WellObservationValue
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.discretization.time.Stressperiods import (
    EndDateTime,
    IsSteadyState,
    NumberOfTimeSteps,
    StartDateTime,
    StressPeriod,
    StressPeriodCollection,
    TimeStepMultiplier,
)
from morpheus.project.types.discretization.time.TimeDiscretization import TimeDiscretization
from morpheus.project.types.discretization.time.TimeUnit import TimeUnit
from morpheus.project.types.geometry import LineString, Point, Polygon
from morpheus.project.types.Model import Model
from morpheus.project.types.observations.HeadObservation import Head, HeadObservation, HeadObservationValue, ObservationId, ObservationName

pytestmark = pytest.mark.unit


def _model_with_boundary(boundary_type, geometry, values):
    model = Model.new()
    grid = model.spatial_discretization.grid
    model = model.with_updated_spatial_discretization(
        model.spatial_discretization.with_updated_affected_cells(ActiveCells.from_polygon(model.spatial_discretization.geometry, grid))
    )
    grid = model.spatial_discretization.grid
    boundary = BoundaryFactory().create_with_default_observation_values(
        boundary_id=BoundaryId.new(),
        boundary_type=boundary_type,
        geometry=geometry,
        affected_cells=ActiveCells.from_geometry(geometry, grid),
        affected_layers=[model.layers[0].layer_id],
        start_date_time=model.time_discretization.start_date_time,
    )
    boundary.observations[0].data = values
    return model.with_updated_boundaries(model.boundaries.with_added_boundary(boundary)), boundary


def _start():
    return StartDateTime.from_datetime(datetime(2020, 1, 1))


def test_chd_mapper_maps_head_values_to_cells():
    start = _start()
    model, boundary = _model_with_boundary(
        BoundaryType.constant_head,
        LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]),
        [ConstantHeadObservationValue(date_time=start, head=HeadValue.from_float(123.0))],
    )

    result = calculate_chd_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert len(result.data) == 1
    assert result.data[0].values == [123.0, 123.0]
    assert result.data[0].layer == 0


def test_drn_mapper_maps_stage_and_conductance():
    model, boundary = _model_with_boundary(
        BoundaryType.drain,
        LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]),
        [DrainRawDataItem(date_time=_start(), stage=DrainStage.from_float(10.0), conductance=DrainConductance.from_float(2.5))],
    )

    result = calculate_drn_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert result.data[0].values == [10.0, 2.5]


def test_ghb_mapper_maps_stage_and_conductance():
    model, boundary = _model_with_boundary(
        BoundaryType.general_head,
        LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]),
        [GeneralHeadRawDataItem(date_time=_start(), stage=GeneralHeadStage.from_float(20.0), conductance=GeneralHeadConductance.from_float(3.5))],
    )

    result = calculate_ghb_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert result.data[0].values == [20.0, 3.5]


def test_riv_mapper_maps_stage_conductance_and_bed_bottom():
    model, boundary = _model_with_boundary(
        BoundaryType.river,
        LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]),
        [
            RiverObservationValue(
                date_time=_start(),
                river_stage=RiverStage.from_float(30.0),
                conductance=RiverConductance.from_float(4.5),
                riverbed_bottom=RiverbedBottom.from_float(25.0),
            )
        ],
    )

    result = calculate_riv_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert result.data[0].values == [30.0, 4.5, 25.0]


def test_rch_mapper_writes_layer_based_data():
    model, boundary = _model_with_boundary(
        BoundaryType.recharge,
        Polygon(coordinates=[[(0.1, 0.1), (0.9, 0.1), (0.9, 0.9), (0.1, 0.9), (0.1, 0.1)]]),
        [RechargeObservationValue(date_time=_start(), recharge_rate=RechargeRate.from_float(0.25))],
    )

    result = calculate_rch_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert result.shape == (1, 1)
    assert result.to_dict()[0][0][0] == 0.25


def test_evt_mapper_exposes_surface_rate_depth_and_layer():
    model, boundary = _model_with_boundary(
        BoundaryType.evapotranspiration,
        Polygon(coordinates=[[(0.1, 0.1), (0.9, 0.1), (0.9, 0.9), (0.1, 0.9), (0.1, 0.1)]]),
        [
            EvapotranspirationObservationValue(
                date_time=_start(),
                surface_elevation=SurfaceElevation.from_float(100.0),
                evapotranspiration=Evapotranspiration.from_float(0.1),
                extinction_depth=ExtinctionDepth.from_float(5.0),
            )
        ],
    )

    result = calculate_evt_boundary_stress_period_data(model.layers, model.spatial_discretization, model.time_discretization, boundary)

    assert result.get_surface_elevation_sp_data()[0][0][0] == 100.0
    assert result.get_evapotranspiration_sp_data()[0][0][0] == 0.1
    assert result.get_extinction_depth_sp_data()[0][0][0] == 5.0
    assert result.get_layer_index_sp_data()[0][0][0] == 0


def test_lak_mapper_serializes_flux_values():
    model, boundary = _model_with_boundary(
        BoundaryType.lake,
        Polygon(coordinates=[[(0.1, 0.1), (0.9, 0.1), (0.9, 0.9), (0.1, 0.9), (0.1, 0.1)]]),
        [
            LakeObservationValue(
                date_time=_start(),
                precipitation=Precipitation.from_float(1.0),
                evaporation=Evaporation.from_float(2.0),
                runoff=Runoff.from_float(3.0),
                withdrawal=Withdrawal.from_float(4.0),
            )
        ],
    )

    result = calculate_lak_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, [boundary])

    assert result.to_dict()[0][0] == [2.0, 1.0, 3.0, 4.0]


def test_fhb_mapper_collects_head_and_flow_dates():
    model, boundary = _model_with_boundary(
        BoundaryType.flow_and_head,
        LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]),
        [FlowAndHeadRawDataItem(date_time=_start(), flow=Flow.from_float(12.0), head=FlowAndHead.from_float(80.0))],
    )

    result = calculate_fhb_boundary_stress_period_data(model.with_updated_boundaries(model.boundaries.with_updated_boundary(boundary)))

    assert result is not None
    assert result.total_times == [0.0]
    assert result.head_data[0].values == [80.0]
    assert result.flow_data[0].values == [12.0]


def test_hob_mapper_maps_observation_values_to_model_time():
    model = Model.new()
    start = model.time_discretization.start_date_time
    observation = HeadObservation.from_geometry(
        id=ObservationId.new(),
        name=ObservationName('head-1'),
        geometry=Point(coordinates=(0.5, 0.5)),
        grid=model.spatial_discretization.grid,
        affected_layers=[model.layers[0].layer_id],
        data=[HeadObservationValue(date_time=start, head=Head.from_value(42.0))],
    )
    model = model.with_updated_observations(model.observations.with_added_observation(observation))

    result = calculate_observation_items(model)

    assert len(result.items) == 1
    assert result.items[0].layer == 0
    assert result.items[0].row == 0
    assert result.items[0].column == 0
    assert result.items[0].time_series_data[0].total_time.to_float() == 0.0
    assert result.items[0].time_series_data[0].head_value.to_value() == 42.0


def test_multiple_stress_periods_preserve_time_step_indices():
    model = Model.new()
    start = StartDateTime.from_datetime(datetime(2020, 1, 1))
    second = StartDateTime.from_datetime(datetime(2020, 1, 2))
    model = model.with_updated_time_discretization(
        TimeDiscretization(
            start_date_time=start,
            end_date_time=EndDateTime.from_datetime(datetime(2020, 1, 3)),
            stress_periods=StressPeriodCollection(
                [
                    StressPeriod(start, NumberOfTimeSteps(1), TimeStepMultiplier(1), IsSteadyState.yes()),
                    StressPeriod(second, NumberOfTimeSteps(1), TimeStepMultiplier(1), IsSteadyState.no()),
                ]
            ),
            time_unit=TimeUnit.days(),
        )
    )
    model, boundary = _model_with_boundary(
        BoundaryType.well,
        Point(coordinates=(0.5, 0.5)),
        [
            WellObservationValue(date_time=start, pumping_rate=PumpingRate.from_float(-10.0)),
            WellObservationValue(date_time=second, pumping_rate=PumpingRate.from_float(-20.0)),
        ],
    )
    model = model.with_updated_time_discretization(
        TimeDiscretization(
            start_date_time=start,
            end_date_time=EndDateTime.from_datetime(datetime(2020, 1, 3)),
            stress_periods=StressPeriodCollection(
                [
                    StressPeriod(start, NumberOfTimeSteps(1), TimeStepMultiplier(1), IsSteadyState.yes()),
                    StressPeriod(second, NumberOfTimeSteps(1), TimeStepMultiplier(1), IsSteadyState.no()),
                ]
            ),
            time_unit=TimeUnit.days(),
        )
    )
    model = model.with_updated_boundaries(model.boundaries.with_added_boundary(boundary))

    result = calculate_wel_boundary_stress_period_data(model.spatial_discretization, model.time_discretization, model.layers, boundary)

    assert [item.time_step for item in result.data] == [0, 1]
    assert [item.values for item in result.data] == [[-10.0], [-20.0]]
