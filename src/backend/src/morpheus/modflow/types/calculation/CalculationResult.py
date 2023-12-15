import dataclasses
from enum import StrEnum


@dataclasses.dataclass(frozen=True)
class Observation:
    name: str
    simulated: float
    observed: float


@dataclasses.dataclass(frozen=True)
class AvailableResults:
    times: list[float]
    kstpkper: list[(int, int)]
    number_of_layers: int
    number_of_observations: int

    @classmethod
    def from_dict(cls, obj):
        return cls(
            times=obj['times'],
            kstpkper=obj['kstpkper'],
            number_of_layers=obj['number_of_layers'],
            number_of_observations=obj['number_of_observations'],
        )

    def to_dict(self) -> dict:
        return {
            'times': self.times,
            'kstpkper': self.kstpkper,
            'number_of_layers': self.number_of_layers,
            'number_of_observations': self.number_of_observations,
        }


class CalculationResultType(StrEnum):
    SUCCESS = 'success'
    FAILURE = 'failure'


@dataclasses.dataclass(frozen=True)
class CalculationResult:
    type: CalculationResultType
    message: str
    files: list[str]
    head_results: AvailableResults | None
    drawdown_results: AvailableResults | None
    budget_results: AvailableResults | None
    concentration_results: AvailableResults | None

    @classmethod
    def failure(cls, message: str, files: list[str]):
        return cls(
            type=CalculationResultType.FAILURE,
            message=message,
            files=files,
            head_results=None,
            drawdown_results=None,
            budget_results=None,
            concentration_results=None,
        )

    @classmethod
    def success(
        cls,
        message: str,
        files: list[str],
        head_results: AvailableResults | None,
        drawdown_results: AvailableResults | None,
        budget_results: AvailableResults | None,
        concentration_results: AvailableResults | None
    ):
        return cls(
            type=CalculationResultType.SUCCESS,
            message=message if message is not None else '',
            files=files,
            head_results=head_results,
            drawdown_results=drawdown_results,
            budget_results=budget_results,
            concentration_results=concentration_results,
        )

    @classmethod
    def try_from_dict(cls, obj):
        if obj is None:
            return None

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
            type=CalculationResultType(obj['type']),
            message=obj['message'],
            files=obj['files'],
            head_results=head_results,
            drawdown_results=drawdown_results,
            budget_results=budget_results,
            concentration_results=transport_results,
        )

    def to_dict(self) -> dict:
        return {
            'type': self.type.value,
            'message': self.message if self.message is not None else '',
            'files': self.files if self.files is not None else [],
            'head_results': self.head_results.to_dict() if self.head_results is not None else None,
            'drawdown_results': self.drawdown_results.to_dict() if self.drawdown_results is not None else None,
            'budget_results': self.budget_results.to_dict() if self.budget_results is not None else None,
            'concentration_results': self.concentration_results.to_dict() if self.concentration_results is not None else None
        }
