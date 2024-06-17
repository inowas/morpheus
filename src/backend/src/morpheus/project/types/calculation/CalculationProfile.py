import dataclasses
from enum import StrEnum
from typing import Mapping

from morpheus.common.types import Uuid, Bool
from morpheus.project.types.calculation.CalculationEngineSettingsBase import CalculationEngineSettingsBase
from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.Mf2005CalculationEngineSettings import \
    Mf2005CalculationEngineSettings


class IsSelected(Bool):
    pass


class CalculationEngineType(StrEnum):
    MF2005 = 'mf2005'
    MF6 = 'mf6'
    MT3DMS = 'mt3dms'


class CalculationProfileId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class CalculationProfile:
    engine_type: CalculationEngineType
    engine_settings: CalculationEngineSettingsBase

    @classmethod
    def new(cls, engine_type: CalculationEngineType):
        if engine_type == CalculationEngineType.MF2005:
            return cls(
                engine_type=engine_type,
                engine_settings=Mf2005CalculationEngineSettings.default(),
            )

        raise NotImplementedError

    @classmethod
    def from_dict(cls, obj):
        engine_type = CalculationEngineType(obj['engine_type'])
        if engine_type == CalculationEngineType.MF2005:
            return cls(
                engine_type=engine_type,
                engine_settings=Mf2005CalculationEngineSettings.from_dict(obj['engine_settings']),
            )

        raise NotImplementedError

    def to_dict(self) -> dict:
        return {
            'engine_type': self.engine_type.value,
            'engine_settings': self.engine_settings.to_dict(),
        }


@dataclasses.dataclass(frozen=True)
class CalculationProfileMap:
    selected_calculation_engine: CalculationEngineType
    calculation_profiles: Mapping[CalculationEngineType, CalculationProfile]

    @classmethod
    def mf2005(cls):
        return cls(
            selected_calculation_engine=CalculationEngineType.MF2005,
            calculation_profiles={
                CalculationEngineType.MF2005: CalculationProfile.new(CalculationEngineType.MF2005)
            }
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            selected_calculation_engine=CalculationEngineType(obj['selected_calculation_engine']),
            calculation_profiles={
                CalculationEngineType(engine_type): CalculationProfile.from_dict(profile) for engine_type, profile in obj['profiles'].items()
            }
        )

    def to_dict(self) -> dict:
        return {
            'selected_calculation_engine': self.selected_calculation_engine.value,
            'profiles': {
                engine_type.value: profile.to_dict() for engine_type, profile in self.calculation_profiles.items()
            }
        }

    def get_selected_profile(self) -> CalculationProfile:
        if self.selected_calculation_engine not in self.calculation_profiles:
            raise ValueError(f'Invalid selected profile: {self.selected_calculation_engine}')

        return self.calculation_profiles[self.selected_calculation_engine]

    def with_selected_profile(self, engine_type: CalculationEngineType) -> 'CalculationProfileMap':
        return dataclasses.replace(self, selected_calculation_engine=engine_type)

    def with_updated_profile(self, profile: CalculationProfile) -> 'CalculationProfileMap':
        calculation_profiles = dict(self.calculation_profiles)
        calculation_profiles[profile.engine_type] = profile

        return dataclasses.replace(self, calculation_profiles=calculation_profiles)

    def with_updated_profile_selected(self, profile: CalculationProfile) -> 'CalculationProfileMap':
        return self.with_updated_profile(profile).with_selected_profile(profile.engine_type)
