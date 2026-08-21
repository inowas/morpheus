import shutil

import pytest

from morpheus.project.infrastructure.calculation.engines.Mf2005CalculationEngine import Mf2005CalculationEngine
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.BasPackageWrapper import BasPackageSettings, calculate_bas_package_data, create_bas_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.BcfPackageWrapper import BcfPackageSettings, calculate_bcf_package_data, create_bcf_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.ChdPackageWrapper import ChdPackageSettings, create_chd_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.De4PackageWrapper import De4PackageSettings, create_de4_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.DisPackageWrapper import DisPackageSettings, calculate_dis_package_data, create_dis_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.DrnPackageWrapper import DrnPackageSettings, create_drn_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.EvtPackageWrapper import EvtPackageSettings, create_evt_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.FhbPackageWrapper import FhbPackageSettings, create_fhb_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.GhbPackageWrapper import GhbPackageSettings, create_ghb_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.GmgPackageWrapper import GmgPackageSettings, create_gmg_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.LakPackageWrapper import LakPackageSettings, create_lak_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.LpfPackageWrapper import LpfPackageSettings, calculate_lpf_package_data, create_lpf_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.MfPackageWrapper import MfPackageSettings, create_mf_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.PcgnPackageWrapper import PcgnPackageSettings, create_pcgn_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.PcgPackageWrapper import PcgPackageSettings, create_pcg_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.RchPackageWrapper import RchPackageSettings, create_rch_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.RivPackageWrapper import RivPackageSettings, create_riv_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.SipPackageWrapper import SipPackageSettings, create_sip_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.WelPackageWrapper import WelPackageSettings, create_wel_package
from morpheus.project.types.boundaries.Boundary import BoundaryId, BoundaryType
from morpheus.project.types.boundaries.BoundaryFactory import BoundaryFactory
from morpheus.project.types.calculation.CalculationProfile import CalculationEngineType, CalculationProfile
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import LineString, Point, Polygon
from morpheus.project.types.Model import Model

pytestmark = pytest.mark.unit


def _base_flopy_model(tmp_path):
    model = Model.new()
    flopy_model = create_mf_package(model, 'package-test', str(tmp_path), MfPackageSettings.default())
    create_dis_package(flopy_model, model, DisPackageSettings.default())
    create_bas_package(flopy_model, model, BasPackageSettings.default())
    return model, flopy_model


def test_core_package_data_matches_model_defaults():
    model = Model.new()

    dis = calculate_dis_package_data(model, DisPackageSettings.default())
    bas = calculate_bas_package_data(model, BasPackageSettings.default())
    lpf = calculate_lpf_package_data(model, LpfPackageSettings.default())
    bcf = calculate_bcf_package_data(model, BcfPackageSettings.default())

    assert (dis.nlay, dis.nrow, dis.ncol, dis.nper) == (1, 1, 1, 1)
    assert len(dis.delr) == dis.ncol
    assert len(dis.delc) == dis.nrow
    assert all(width > 0 for width in dis.delr)
    assert all(height > 0 for height in dis.delc)
    assert bas.ibound == [[[0]]]
    assert bas.strt == [1.0]
    assert lpf.laytyp == [0]
    assert lpf.hk == [1.0]
    assert bcf.laycon == [0]
    assert bcf.tran == [1.0]


@pytest.mark.parametrize(
    ('factory', 'settings', 'package_name'),
    [
        (create_de4_package, De4PackageSettings.default(), 'DE4'),
        (create_gmg_package, GmgPackageSettings.default(), 'GMG'),
        (create_pcg_package, PcgPackageSettings.default(), 'PCG'),
        (create_pcgn_package, PcgnPackageSettings.default(), 'PCGN'),
        (create_sip_package, SipPackageSettings.default(), 'SIP'),
    ],
)
def test_solver_wrappers_create_flopy_packages(tmp_path, factory, settings, package_name):
    model, flopy_model = _base_flopy_model(tmp_path)

    package = factory(flopy_model, model, settings)

    assert package.name[0] == package_name


def test_flow_wrappers_create_lpf_and_bcf(tmp_path):
    model, flopy_model = _base_flopy_model(tmp_path)

    lpf = create_lpf_package(flopy_model, model, LpfPackageSettings.default())
    bcf = create_bcf_package(flopy_model, model, BcfPackageSettings.default())

    assert lpf.name[0] == 'LPF'
    assert bcf.name[0] == 'BCF6'


def test_empty_boundary_wrappers_return_no_package(tmp_path):
    model, flopy_model = _base_flopy_model(tmp_path)

    wrappers = [
        (create_chd_package, ChdPackageSettings.default()),
        (create_drn_package, DrnPackageSettings.default()),
        (create_evt_package, EvtPackageSettings.default()),
        (create_fhb_package, FhbPackageSettings.default()),
        (create_ghb_package, GhbPackageSettings.default()),
        (create_lak_package, LakPackageSettings.default()),
        (create_rch_package, RchPackageSettings.default()),
        (create_riv_package, RivPackageSettings.default()),
        (create_wel_package, WelPackageSettings.default()),
    ]

    for factory, settings in wrappers:
        assert factory(flopy_model, model, settings) is None


@pytest.mark.parametrize(
    ('boundary_type', 'geometry', 'factory', 'settings', 'package_name'),
    [
        ('constant_head', LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]), create_chd_package, ChdPackageSettings.default(), 'CHD'),
        ('drain', LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]), create_drn_package, DrnPackageSettings.default(), 'DRN'),
        ('evapotranspiration', Polygon(coordinates=[[(0.1, 0.1), (0.9, 0.1), (0.9, 0.9), (0.1, 0.9), (0.1, 0.1)]]), create_evt_package, EvtPackageSettings.default(), 'EVT'),
        ('flow_and_head', LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]), create_fhb_package, FhbPackageSettings.default(), 'FHB'),
        ('general_head', LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]), create_ghb_package, GhbPackageSettings.default(), 'GHB'),
        ('lake', Polygon(coordinates=[[(0.1, 0.1), (0.9, 0.1), (0.9, 0.9), (0.1, 0.9), (0.1, 0.1)]]), create_lak_package, LakPackageSettings.default(), 'LAK'),
        ('recharge', Polygon(coordinates=[[(0.1, 0.1), (0.9, 0.1), (0.9, 0.9), (0.1, 0.9), (0.1, 0.1)]]), create_rch_package, RchPackageSettings.default(), 'RCH'),
        ('river', LineString(coordinates=[(0.1, 0.5), (0.9, 0.5)]), create_riv_package, RivPackageSettings.default(), 'RIV'),
        ('well', Point(coordinates=(0.5, 0.5)), create_wel_package, WelPackageSettings.default(), 'WEL'),
    ],
)
def test_boundary_wrappers_create_flopy_packages(tmp_path, boundary_type, geometry, factory, settings, package_name):
    model = Model.new()
    model = model.with_updated_spatial_discretization(
        model.spatial_discretization.with_updated_affected_cells(ActiveCells.from_polygon(model.spatial_discretization.geometry, model.spatial_discretization.grid))
    )
    boundary = BoundaryFactory().create_with_default_observation_values(
        boundary_id=BoundaryId.new(),
        boundary_type=BoundaryType(boundary_type),
        geometry=geometry,
        affected_cells=ActiveCells.from_geometry(geometry, model.spatial_discretization.grid),
        affected_layers=[model.layers[0].layer_id],
        start_date_time=model.time_discretization.start_date_time,
    )
    model = model.with_updated_boundaries(model.boundaries.with_added_boundary(boundary))
    _, flopy_model = _base_flopy_model(tmp_path)

    package = factory(flopy_model, model, settings)

    assert package is not None
    assert package.name[0] == package_name


@pytest.mark.parametrize('solver', ['de4', 'gmg', 'pcg', 'pcgn', 'sip'])
@pytest.mark.parametrize('flow', ['lpf', 'bcf'])
def test_engine_preprocess_supports_solver_and_flow_combinations(tmp_path, solver, flow):
    engine = Mf2005CalculationEngine(str(tmp_path))
    profile = CalculationProfile.new(CalculationEngineType.MF2005)
    profile.engine_settings.selected_solver_package = solver
    profile.engine_settings.selected_flow_package = flow

    log = engine.preprocess(Model.new(), profile)

    assert log.to_list()


@pytest.mark.modflow
def test_minimal_modflow_run_produces_head_output(tmp_path):
    if shutil.which('mf2005') is None:
        pytest.skip('mf2005 executable is not installed')

    engine = Mf2005CalculationEngine(str(tmp_path))
    profile = CalculationProfile.new(CalculationEngineType.MF2005)
    log, result = engine.run(Model.new(), profile)

    assert log.to_list()
    assert result.type.value == 'success'
    assert result.flow_head_results is not None
    assert result.flow_head_results.times == [1.0]
    assert 'mf2005.hds' in result.files
    assert {'DIS', 'BAS6', 'PCG', 'LPF', 'OC'} <= set(result.packages)
    assert engine.read_flow_head(idx=0, layer=0) == [[-9999.0]]
