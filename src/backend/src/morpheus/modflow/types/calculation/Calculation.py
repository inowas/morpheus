import dataclasses
from enum import StrEnum

from morpheus.common.types import Uuid
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.calculation.CalculationProfile import CalculationProfile
from morpheus.modflow.types.calculation.CalculationResult import CalculationResult


class CalculationId(Uuid):
    pass


class CalculationState(StrEnum):
    CREATED = 'created'
    PREPROCESSING = 'preprocessing'
    RUNNING = 'running'
    FINISHED = 'finished'
    ERROR = 'error'


@dataclasses.dataclass(frozen=True)
class CalculationLog:
    log: list[str]

    @classmethod
    def try_from_list(cls, log: list[str] | None):
        if log is None:
            return None
        return cls.from_list(log)

    @classmethod
    def from_list(cls, log: list[str]):
        return cls(log=log)

    def to_list(self) -> list[str]:
        return self.log


@dataclasses.dataclass
class Calculation:
    calculation_id: CalculationId
    modflow_model: ModflowModel
    calculation_profile: CalculationProfile
    calculation_lifecycle: list[CalculationState]
    calculation_state: CalculationState
    calculation_log: CalculationLog | None
    calculation_result: CalculationResult | None

    @classmethod
    def new(cls, modflow_model: ModflowModel, calculation_profile: CalculationProfile):
        return cls(
            calculation_id=CalculationId.new(),
            modflow_model=modflow_model,
            calculation_profile=calculation_profile,
            calculation_lifecycle=[CalculationState.CREATED],
            calculation_state=CalculationState.CREATED,
            calculation_log=None,
            calculation_result=None,
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            calculation_id=CalculationId.from_str(obj['calculation_id']),
            modflow_model=ModflowModel.from_dict(obj['modflow_model']),
            calculation_profile=CalculationProfile.from_dict(obj['calculation_profile']),
            calculation_lifecycle=[CalculationState(state) for state in obj['calculation_lifecycle']],
            calculation_state=CalculationState(obj['calculation_state']),
            calculation_log=CalculationLog.try_from_list(obj['calculation_log']),
            calculation_result=CalculationResult.try_from_dict(obj['calculation_result'])
        )

    def to_dict(self) -> dict:
        return {
            'calculation_id': self.calculation_id.to_str(),
            'modflow_model': self.modflow_model.to_dict(),
            'calculation_profile': self.calculation_profile.to_dict(),
            'calculation_lifecycle': [state.value for state in self.calculation_lifecycle],
            'calculation_state': self.calculation_state.value,
            'calculation_log': self.calculation_log.to_list() if self.calculation_log is not None else None,
            'calculation_result': self.calculation_result.to_dict() if self.calculation_result is not None else None,
        }

    def set_new_state(self, new_state: CalculationState):
        self.calculation_state = new_state
        self.calculation_lifecycle.append(new_state)

    def set_log(self, log: CalculationLog):
        self.calculation_log = log

    def append_to_log(self, message: str):
        if self.calculation_log is None:
            self.calculation_log = CalculationLog(log=[message])
            return

        self.calculation_log.log.append(message)

    def set_result(self, result: CalculationResult):
        self.calculation_result = result
