import dataclasses
from enum import StrEnum

from morpheus.common.types import Uuid
from morpheus.modflow.types.calculation.CalculationEngineSettingsBase import CalculationEngineSettingsBase
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.types.Mf2005CalculationEngineSettings import \
    Mf2005CalculationEngineSettings


class CalculationType(StrEnum):
    MF2005 = 'mf2005'
    MF6 = 'mf6'
    MT3DMS = 'mt3dms'


class CalculationProfileId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class CalculationProfile:
    calculation_profile_id: CalculationProfileId
    calculation_engine_type: CalculationType
    calculation_engine_settings: CalculationEngineSettingsBase

    @classmethod
    def new(cls, engine_type: CalculationType):
        if engine_type == CalculationType.MF2005:
            return cls(
                calculation_profile_id=CalculationProfileId.new(),
                calculation_engine_type=engine_type,
                calculation_engine_settings=Mf2005CalculationEngineSettings.default()
            )

        raise NotImplementedError

    @classmethod
    def from_dict(cls, obj: dict):
        calculation_engine_type = CalculationType(obj['calculation_engine_type'])
        if calculation_engine_type == CalculationType.MF2005:
            return cls(
                calculation_profile_id=CalculationProfileId.from_value(obj['calculation_profile_id']),
                calculation_engine_type=calculation_engine_type,
                calculation_engine_settings=Mf2005CalculationEngineSettings.from_dict(
                    obj['calculation_engine_settings'])
            )

        raise NotImplementedError

    def to_dict(self) -> dict:
        return {
            'calculation_profile_id': self.calculation_profile_id.value,
            'calculation_engine_type': self.calculation_engine_type.value,
            'calculation_engine_settings': self.calculation_engine_settings.to_dict()
        }


@dataclasses.dataclass
class CalculationProfiles:
    selected_calculation_type: CalculationType
    values: dict[CalculationType, CalculationProfile]

    @classmethod
    def new(cls):
        return cls(
            selected_calculation_type=CalculationType.MF2005,
            values={
                CalculationType.MF2005: CalculationProfile.new(CalculationType.MF2005)
            },
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            selected_calculation_type=CalculationType(obj['selected_calculation_type']),
            values={CalculationType(key): CalculationProfile.from_dict(value) for key, value in obj.items()}
        )

    def to_dict(self) -> dict:
        return {
            'selected_calculation_type': self.selected_calculation_type.value,
            **{key.value: value.to_dict() for key, value in self.values.items()}
        }

    def get_selected_calculation_profile(self) -> CalculationProfile:
        return self.values[self.selected_calculation_type]

    def set_selected_calculation_type(self, calculation_type: CalculationType):
        return dataclasses.replace(self, selected_calculation_type=calculation_type)

    def update_calculation_profile(self, calculation_profile: CalculationProfile):
        self.values[calculation_profile.calculation_engine_type] = calculation_profile
        return dataclasses.replace(self, values=self.values)

    def get_calculation_profile(self, calculation_type: CalculationType) -> CalculationProfile:
        if calculation_type not in self.values:
            self.values[calculation_type] = CalculationProfile.new(calculation_type)

        return self.values[calculation_type]
