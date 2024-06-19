import os

from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineBase import CalculationEngineBase
from morpheus.project.infrastructure.calculation.engines.Mf2005CalculationEngine import Mf2005CalculationEngine
from morpheus.project.types.calculation.Calculation import Calculation
from morpheus.project.types.calculation.CalculationProfile import CalculationEngineType
from morpheus.settings import settings


class CalculationEngineFactory:
    @classmethod
    def create_engine(cls, calculation: Calculation) -> CalculationEngineBase:
        if calculation.calculation_profile.engine_type == CalculationEngineType.MF2005:
            return Mf2005CalculationEngine(workspace_path=os.path.join(settings.MORPHEUS_PROJECT_CALCULATION_DATA, calculation.calculation_id.to_str()))

        raise Exception(f'No engine found for {calculation.calculation_profile.engine_type.value}')
