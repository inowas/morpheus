import dataclasses
from typing import Literal

from morpheus.common.types import Uuid
from morpheus.modflow.infrastructure.calculation.types.CalculationProfileBase import CalculationProfileBase
from morpheus.modflow.types.ModflowModel import ModflowModel


class CalculationId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class CalculationState:
    state: Literal['created', 'preprocessed', 'queued', 'running', 'success', 'failed']

    def __eq__(self, other):
        return self.state == other.state

    def to_str(self) -> str:
        return self.state

    def to_value(self) -> str:
        return self.state

    @classmethod
    def from_str(cls, value: Literal['created', 'preprocessed', 'queued', 'running', 'success', 'failed']):
        return cls(state=value)

    @classmethod
    def from_value(cls, value: Literal['created', 'preprocessed', 'queued', 'running', 'success', 'failed']):
        return cls.from_str(value=value)

    @classmethod
    def created(cls):
        return cls.from_str('created')

    @classmethod
    def preprocessing(cls):
        return cls.from_str('preprocessed')

    @classmethod
    def queued(cls):
        return cls.from_str('queued')

    @classmethod
    def running(cls):
        return cls.from_str('running')

    @classmethod
    def success(cls):
        return cls.from_str('success')

    @classmethod
    def failed(cls):
        return cls.from_str('failed')


@dataclasses.dataclass(frozen=True)
class CalculationType:
    value: Literal['mf2005', 'mf6', 'mt3dms']

    def to_str(self) -> str:
        return self.value

    def to_value(self) -> str:
        return self.value

    @classmethod
    def from_str(cls, value: Literal['mf2005', 'mf6', 'mt3dms']):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: Literal['mf2005', 'mf6', 'mt3dms']):
        return cls.from_str(value=value)

    @classmethod
    def mf2005(cls):
        return cls.from_str('mf2005')

    @classmethod
    def mf6(cls):
        return cls.from_str('mf6')

    @classmethod
    def mt3dms(cls):
        return cls.from_str('mt3dms')


@dataclasses.dataclass(frozen=True)
class AvailableResults:
    times: list[float]
    kstpkper: list[(int, int)]
    number_of_layers: int

    @classmethod
    def from_dict(cls, obj):
        return cls(
            times=obj['times'],
            kstpkper=obj['kstpkper'],
            number_of_layers=obj['number_of_layers'],
        )

    def to_dict(self) -> dict:
        return {
            'times': self.times,
            'kstpkper': self.kstpkper,
            'number_of_layers': self.number_of_layers,
        }


@dataclasses.dataclass(frozen=True)
class CalculationLog:
    log: list[str]

    @classmethod
    def from_list(cls, log: list[str] | None):
        if log is None:
            return None
        return cls(log=log)

    def to_list(self) -> list[str]:
        return self.log


@dataclasses.dataclass(frozen=True)
class CalculationResult:
    state: CalculationState
    message: str
    files: list[str]
    head_results: AvailableResults | None
    drawdown_results: AvailableResults | None
    budget_results: AvailableResults | None
    concentration_results: AvailableResults | None

    @classmethod
    def from_dict(cls, obj):
        head_results = AvailableResults.from_dict(obj['head_results']) \
            if ('flow_results' in obj and obj['flow_results'] is not None) \
            else None
        drawdown_results = AvailableResults.from_dict(obj['drawdown_results']) \
            if ('drawdown_results' in obj and obj['drawdown_results'] is not None) \
            else None
        budget_results = AvailableResults.from_dict(obj['budget_results']) \
            if ('budget_results' in obj and obj['budget_results'] is not None) \
            else None
        transport_results = AvailableResults.from_dict(obj['concentration_results']) \
            if ('transport_results' in obj and obj['concentration_results'] is not None) \
            else None

        return cls(
            state=CalculationState.from_value(obj['state']),
            message=obj['message'],
            files=obj['files'],
            head_results=head_results,
            drawdown_results=drawdown_results,
            budget_results=budget_results,
            concentration_results=transport_results,
        )

    def to_dict(self) -> dict:
        return {
            'state': self.state.to_value(),
            'message': self.message if self.message is not None else '',
            'files': self.files if self.files is not None else [],
            'head_results': self.head_results.to_dict() if self.head_results is not None else None,
            'drawdown_results': self.drawdown_results.to_dict() if self.drawdown_results is not None else None,
            'budget_results': self.budget_results.to_dict() if self.budget_results is not None else None,
            'concentration_results': self.concentration_results.to_dict() if self.concentration_results is not None else None
        }


class CalculationBase:
    calculation_id: CalculationId
    modflow_model: ModflowModel
    calculation_profile: CalculationProfileBase
    calculation_type: CalculationType
    calculation_state: CalculationState
    calculation_log: CalculationLog | None
    calculation_result: CalculationResult | None

    @classmethod
    def new(cls, modflow_model: ModflowModel, calculation_profile: CalculationProfileBase):
        raise NotImplementedError()

    @classmethod
    def from_dict(cls, obj):
        raise NotImplementedError()

    def preprocess(self, data_base_path: str):
        raise NotImplementedError()

    def has_been_preprocessed(self) -> bool:
        raise NotImplementedError()

    def check(self):
        raise NotImplementedError()

    def write_input(self):
        raise NotImplementedError()

    def run(self):
        raise NotImplementedError()

    def has_been_processed(self):
        if self.calculation_result is not None:
            return True

        if self.calculation_state == CalculationState.success():
            return True

        if self.calculation_state == CalculationState.failed():
            return True

        return False

    def process(self, data_base_path: str):
        raise NotImplementedError()

    def postprocess(self):
        raise NotImplementedError()

    def to_dict(self) -> dict:
        raise NotImplementedError()
