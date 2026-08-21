import shutil

import pytest

from morpheus.project.infrastructure.calculation.engines.Mf2005CalculationEngine import Mf2005CalculationEngine
from morpheus.project.types.calculation.CalculationProfile import CalculationEngineType, CalculationProfile
from morpheus.project.types.Model import Model

pytestmark = pytest.mark.modflow


@pytest.fixture
def mf2005_engine(tmp_path):
    if shutil.which('mf2005') is None:
        pytest.skip('mf2005 executable is not installed')

    engine = Mf2005CalculationEngine(str(tmp_path))
    profile = CalculationProfile.new(CalculationEngineType.MF2005)
    engine.run(Model.new(), profile)
    return engine


def test_engine_exposes_flow_head_and_drawdown(mf2005_engine):
    assert mf2005_engine.read_flow_head(idx=0, layer=0) == [[-9999.0]]
    assert mf2005_engine.read_flow_drawdown(idx=0, layer=0) == []
    assert mf2005_engine.read_flow_head_time_series(layer=0, row=0, col=0) == [[1.0, -9999.0]]
    assert mf2005_engine.read_flow_drawdown_time_series(layer=0, row=0, col=0) == []


def test_engine_exposes_budget_and_package_metadata(mf2005_engine):
    budget = mf2005_engine.read_flow_budget(idx=0)

    assert budget['TOTAL_IN'] == 0.0
    assert budget['TOTAL_OUT'] == -0.0
    assert budget['IN-OUT'] == 0.0
    assert {'DIS', 'BAS6', 'PCG', 'LPF', 'OC'} <= set(mf2005_engine.get_packages())
    assert mf2005_engine.get_package('LPF') is not None
    assert mf2005_engine.get_package('MISSING') is None


def test_engine_rejects_missing_reader_selector(mf2005_engine):
    with pytest.raises(Exception, match='Either totim, idx or kstpkper must be specified'):
        mf2005_engine.read_flow_head(layer=0)


def test_engine_reads_existing_and_missing_files(mf2005_engine):
    assert 'LPF' in mf2005_engine.read_file('mf2005.nam')
    assert mf2005_engine.read_file('missing.file') is None
    assert mf2005_engine.read_number_of_head_observations() == 0
    assert mf2005_engine.read_head_observations(Model.new()) == []
