import dataclasses
from enum import StrEnum

from morpheus.modflow.infrastructure.calculation.CalculationEngineSettingsBase import CalculationEngineSettingsBase
from morpheus.modflow.infrastructure.calculation.modflow_2005.Mf2005CalculationEngineSettings import \
    Mf2005CalculationEngineSettings


class CalculationEngineType(StrEnum):
    MF2005 = 'mf2005'
    MF6 = 'mf6'
    MT3DMS = 'mt3dms'


@dataclasses.dataclass(frozen=True)
class CalculationProfile:
    calculation_engine_type: CalculationEngineType
    calculation_engine_settings: CalculationEngineSettingsBase

    @classmethod
    def new(cls, engine_type: CalculationEngineType):
        if engine_type == CalculationEngineType.MF2005:
            return cls(
                calculation_engine_type=engine_type,
                calculation_engine_settings=Mf2005CalculationEngineSettings.default()
            )

        raise NotImplementedError

    @classmethod
    def from_dict(cls, obj: dict):
        calculation_engine_type = CalculationEngineType(obj['calculation_engine_type'])
        if calculation_engine_type == CalculationEngineType.MF2005:
            return cls(
                calculation_engine_type=calculation_engine_type,
                calculation_engine_settings=Mf2005CalculationEngineSettings.from_dict(
                    obj['calculation_engine_settings'])
            )

        raise NotImplementedError

    def to_dict(self) -> dict:
        return {
            'calculation_engine_type': self.calculation_engine_type.value,
            'calculation_engine_settings': self.calculation_engine_settings.to_dict()
        }
