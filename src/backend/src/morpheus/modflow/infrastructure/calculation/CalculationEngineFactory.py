import os

from morpheus.modflow.infrastructure.calculation.CalculationEngineBase import CalculationEngineBase
from morpheus.modflow.infrastructure.calculation.modflow_2005.Mf2005CalculationEngine import Mf2005CalculationEngine
from morpheus.modflow.types.calculation.Calculation import Calculation
from morpheus.modflow.types.calculation.CalculationProfile import CalculationEngineType
from morpheus.settings import settings

class CalculationEngineFactory:
    @classmethod
    def create_engine(cls, calculation: Calculation) -> CalculationEngineBase:
        if calculation.calculation_profile.calculation_engine_type == CalculationEngineType.MF2005:
            return Mf2005CalculationEngine(workspace_path=os.path.join(settings.MORPHEUS_MODFLOW_LOCAL_DATA, calculation.calculation_id.to_str()))

        raise Exception(f'No engine found for {calculation.calculation_profile.calculation_engine_type.value}')
