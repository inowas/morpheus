import dataclasses
from enum import StrEnum

from morpheus.common.types import Uuid
from morpheus.project.types.Model import Model, ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile, CalculationProfileId, CalculationEngineType
from morpheus.project.types.calculation.CalculationResult import CalculationResult


class CalculationId(Uuid):
    pass


class CalculationState(StrEnum):
    CREATED = 'created'
    QUEUED = 'queued'
    PREPROCESSING = 'preprocessing'
    PREPROCESSED = 'preprocessed'
    CALCULATING = 'calculating'
    COMPLETED = 'completed'
    CANCELED = 'canceled'
    FAILED = 'failed'


@dataclasses.dataclass(frozen=True)
class Log:
    log: list[str]

    @classmethod
    def try_from_list(cls, log: list[str] | None):
        if log is None:
            return None
        return cls.from_list(log)

    @classmethod
    def from_list(cls, log: list[str]):
        return cls(log=log)

    @classmethod
    def from_str(cls, log: str):
        return cls.from_list([str(log)])

    def to_list(self) -> list[str]:
        return self.log


@dataclasses.dataclass(frozen=True)
class Calculation:
    project_id: ProjectId
    calculation_id: CalculationId
    model_id: ModelId
    model_hash: str
    model_version: str
    profile_id: CalculationProfileId
    profile_hash: str
    engine_type: CalculationEngineType
    lifecycle: list[CalculationState]
    state: CalculationState
    check_model_log: Log | None
    calculation_log: Log | None
    result: CalculationResult | None

    @classmethod
    def new(cls, project_id: ProjectId, model: Model, profile: CalculationProfile, calculation_id: CalculationId | None = None, model_version: str = ''):
        return cls(
            project_id=project_id,
            calculation_id=calculation_id or CalculationId.new(),
            model_id=model.model_id,
            model_hash=model.get_sha1_hash().to_str(),
            model_version=model_version,
            profile_id=profile.id,
            profile_hash=profile.get_sha1_hash().to_str(),
            engine_type=profile.engine_type,
            lifecycle=[CalculationState.CREATED],
            state=CalculationState.CREATED,
            check_model_log=None,
            calculation_log=None,
            result=None,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            project_id=ProjectId.from_str(obj['project_id']),
            calculation_id=CalculationId.from_str(obj['calculation_id']),
            model_id=ModelId.from_str(obj['model_id']),
            model_hash=obj['model_hash'],
            model_version=obj['model_version'],
            profile_id=CalculationProfileId.from_str(obj['profile_id']),
            profile_hash=obj['profile_hash'],
            engine_type=CalculationEngineType(obj['engine_type']),
            lifecycle=[CalculationState(state) for state in obj['lifecycle']],
            state=CalculationState(obj['state']),
            check_model_log=Log.try_from_list(obj['check_model_log']) if obj['check_model_log'] is not None else None,
            calculation_log=Log.try_from_list(obj['calculation_log']) if obj['calculation_log'] is not None else None,
            result=CalculationResult.try_from_dict(obj['result']) if obj['result'] is not None else None,
        )

    def to_dict(self) -> dict:
        return {
            'project_id': self.project_id.to_str(),
            'calculation_id': self.calculation_id.to_str(),
            'model_id': self.model_id.to_str(),
            'model_hash': self.model_hash,
            'model_version': self.model_version,
            'profile_id': self.profile_id.to_str(),
            'profile_hash': self.profile_hash,
            'engine_type': self.engine_type.value,
            'lifecycle': [state.value for state in self.lifecycle],
            'state': self.state.value,
            'check_model_log': self.check_model_log.to_list() if self.check_model_log is not None else None,
            'calculation_log': self.calculation_log.to_list() if self.calculation_log is not None else None,
            'result': self.result.to_dict() if self.result is not None else None,
        }

    def with_updated_state(self, state: CalculationState) -> 'Calculation':
        return dataclasses.replace(self, state=state, lifecycle=self.lifecycle + [state])

    def with_updated_check_model_log(self, check_model_log: Log) -> 'Calculation':
        return dataclasses.replace(self, check_model_log=check_model_log)

    def with_updated_calculation_log(self, calculation_log: Log) -> 'Calculation':
        return dataclasses.replace(self, calculation_log=calculation_log)

    def with_updated_result(self, result: CalculationResult) -> 'Calculation':
        return dataclasses.replace(self, result=result)

    def get_project_id(self) -> ProjectId:
        return self.project_id

    def get_calculation_id(self) -> CalculationId:
        return self.calculation_id

    def get_model_id(self) -> ModelId:
        return self.model_id

    def get_model_hash(self) -> str:
        return self.model_hash

    def get_profile_id(self) -> CalculationProfileId:
        return self.profile_id

    def get_profile_hash(self) -> str:
        return self.profile_hash

    def get_engine_type(self) -> CalculationEngineType:
        return self.engine_type

    def get_model_version(self) -> str:
        return self.model_version
