import dataclasses
import hashlib
import json
from enum import StrEnum

from morpheus.common.types import Uuid, String
from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineSettingsBase import CalculationEngineSettingsBase
from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.Mf2005CalculationEngineSettings import Mf2005CalculationEngineSettings
from morpheus.project.types.Model import Sha1Hash


class CalculationEngineType(StrEnum):
    MF2005 = 'mf2005'
    MF6 = 'mf6'
    MT3DMS = 'mt3dms'
    SEAWAT = 'seawat'


class CalculationProfileId(Uuid):
    pass


class CalculationProfileName(String):
    pass


@dataclasses.dataclass(frozen=True)
class CalculationProfile:
    id: CalculationProfileId
    name: CalculationProfileName
    engine_type: CalculationEngineType
    engine_settings: CalculationEngineSettingsBase

    @classmethod
    def default(cls):
        return cls(
            id=CalculationProfileId.new(),
            name=CalculationProfileName.from_str('MF2005 default profile'),
            engine_type=CalculationEngineType.MF2005,
            engine_settings=Mf2005CalculationEngineSettings.default(),
        )

    @classmethod
    def new(cls, engine_type: CalculationEngineType):
        if engine_type == CalculationEngineType.MF2005:
            return cls(
                id=CalculationProfileId.new(),
                name=CalculationProfileName.from_str(f'new {engine_type.value} profile'),
                engine_type=engine_type,
                engine_settings=Mf2005CalculationEngineSettings.default(),
            )

        raise NotImplementedError

    @classmethod
    def from_dict(cls, obj):
        engine_type = CalculationEngineType(obj['engine_type'])
        if engine_type == CalculationEngineType.MF2005:
            return cls(
                id=CalculationProfileId.from_str(obj['id']),
                name=CalculationProfileName.from_str(obj['name']),
                engine_type=engine_type,
                engine_settings=Mf2005CalculationEngineSettings.from_dict(obj['engine_settings']),
            )

        raise NotImplementedError

    def to_dict(self) -> dict:
        return {
            'id': self.id.to_str(),
            'name': self.name.to_str(),
            'engine_type': self.engine_type.value,
            'engine_settings': self.engine_settings.to_dict(),
        }

    def get_sha1_hash(self) -> Sha1Hash:
        dictionary = self.to_dict()
        dictionary.pop('id')
        dictionary.pop('name')
        encoded = json.dumps(dictionary, sort_keys=True, ensure_ascii=True).encode()
        return Sha1Hash.from_str(hashlib.sha1(encoded).hexdigest())
