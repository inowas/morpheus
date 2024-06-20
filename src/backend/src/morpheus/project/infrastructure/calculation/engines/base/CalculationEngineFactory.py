import os

from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineBase import CalculationEngineBase
from morpheus.project.infrastructure.calculation.engines.Mf2005CalculationEngine import Mf2005CalculationEngine
from morpheus.project.types.calculation.Calculation import CalculationId
from morpheus.project.types.calculation.CalculationProfile import CalculationEngineType
from morpheus.settings import settings


class CalculationEngineFactory:
    @classmethod
    def create_engine(cls, calculation_id: CalculationId, engine_type: CalculationEngineType) -> CalculationEngineBase:
        if engine_type == CalculationEngineType.MF2005:
            workspace_path = os.path.join(settings.MORPHEUS_PROJECT_CALCULATION_DATA, calculation_id.to_str())
            return Mf2005CalculationEngine(workspace_path=workspace_path)

        raise Exception(f'No engine found for {engine_type.value}')
