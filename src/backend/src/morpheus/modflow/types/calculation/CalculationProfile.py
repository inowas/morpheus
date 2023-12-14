import dataclasses
from enum import StrEnum


class CalculationEngineType(StrEnum):
    MF2005 = 'mf2005'
    MF6 = 'mf6'
    MT3DMS = 'mt3dms'


@dataclasses.dataclass(frozen=True)
class CalculationEngineSettingsBase:
    @classmethod
    def from_dict(cls, obj: dict):
        raise NotImplementedError

    def to_dict(self) -> dict:
        raise NotImplementedError


@dataclasses.dataclass(frozen=True)
class CalculationProfile:
    calculation_engine_type: CalculationEngineType
    calculation_engine_settings: dict

    @classmethod
    def new(cls, engine_type: CalculationEngineType, engine_settings: dict):
        return cls(
            calculation_engine_type=engine_type,
            calculation_engine_settings=engine_settings
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            calculation_engine_type=CalculationEngineType(obj['calculation_engine_type']),
            calculation_engine_settings=obj['calculation_engine_settings']
        )

    def to_dict(self) -> dict:
        return {
            'calculation_engine_type': self.calculation_engine_type.value,
            'calculation_engine_settings': self.calculation_engine_settings
        }
