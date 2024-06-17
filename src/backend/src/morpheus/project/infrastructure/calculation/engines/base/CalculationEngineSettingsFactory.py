from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineSettingsBase import CalculationEngineSettingsBase
from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.Mf2005CalculationEngineSettings import Mf2005CalculationEngineSettings
from morpheus.project.types.calculation.CalculationProfile import CalculationEngineType


class CalculationEngineSettingsFactory:
    @classmethod
    def create_engine_settings(cls, engine_type: CalculationEngineType, data) -> CalculationEngineSettingsBase:
        if engine_type == CalculationEngineType.MF2005:
            return Mf2005CalculationEngineSettings.from_dict(data)

        raise NotImplementedError(f'No engine settings found for {engine_type.value}')
