import dataclasses
from enum import StrEnum

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
    profile_id: CalculationProfileId
    engine_type: CalculationEngineType
    engine_settings: CalculationEngineSettingsBase
    is_selected: IsSelected

    @classmethod
    def new(cls, engine_type: CalculationEngineType):
        if engine_type == CalculationEngineType.MF2005:
            return cls(
                profile_id=CalculationProfileId.new(),
                engine_type=engine_type,
                engine_settings=Mf2005CalculationEngineSettings.default(),
                is_selected=IsSelected.yes()
            )

        raise NotImplementedError

    @classmethod
    def from_dict(cls, obj):
        engine_type = CalculationEngineType(obj['engine_type'])
        if engine_type == CalculationEngineType.MF2005:
            return cls(
                profile_id=CalculationProfileId.from_value(obj['profile_id']),
                engine_type=engine_type,
                engine_settings=Mf2005CalculationEngineSettings.from_dict(obj['engine_settings']),
                is_selected=IsSelected.from_value(obj['is_selected'])
            )

        raise NotImplementedError

    def to_dict(self) -> dict:
        return {
            'profile_id': self.profile_id.value,
            'engine_type': self.engine_type.value,
            'engine_settings': self.engine_settings.to_dict(),
            'is_selected': self.is_selected.to_value()
        }

    def with_updated_is_selected(self, is_selected: IsSelected) -> 'CalculationProfile':
        return dataclasses.replace(self, is_selected=is_selected)


@dataclasses.dataclass(frozen=True)
class CalculationProfileCollection:
    profiles: list[CalculationProfile]

    @classmethod
    def new(cls):
        return cls(profiles=[
            CalculationProfile.new(CalculationEngineType.MF2005)
        ])

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(profiles=[CalculationProfile.from_dict(profile) for profile in obj['profiles']])

    def to_dict(self) -> dict:
        return {
            'profiles': [profile.to_dict() for profile in self.profiles]
        }

    def has_profile(self, profile_id: CalculationProfileId) -> bool:
        for profile in self.profiles:
            if profile.profile_id == profile_id:
                return True

        return False

    def get_selected_profile(self) -> CalculationProfile:
        for profile in self.profiles:
            if profile.is_selected:
                return profile

        raise Exception('No selected profile found')

    def with_selected_profile(self, profile_id: CalculationProfileId) -> 'CalculationProfileCollection':
        profiles = []
        for profile in self.profiles:
            if profile.profile_id == profile_id:
                profiles.append(profile.with_updated_is_selected(IsSelected.yes()))
                continue

            profiles.append(profile.with_updated_is_selected(IsSelected.no()))

        return dataclasses.replace(self, profiles=profiles)

    def with_updated_profile(self, profile: CalculationProfile) -> 'CalculationProfileCollection':
        profiles = []
        for p in self.profiles:
            if p.profile_id == profile.profile_id:
                profiles.append(profile)
                continue

            profiles.append(p)

        return dataclasses.replace(self, profiles=profiles)

    def with_added_profile(self, profile: CalculationProfile) -> 'CalculationProfileCollection':
        return dataclasses.replace(self, profiles=self.profiles + [profile])
