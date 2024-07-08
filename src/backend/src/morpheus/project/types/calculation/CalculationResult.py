import dataclasses
from enum import StrEnum


@dataclasses.dataclass(frozen=True)
class CalculationHeadObservation:
    name: str
    simulated: float
    observed: float

    @classmethod
    def from_dict(cls, obj):
        return cls(
            name=obj['name'],
            simulated=obj['simulated'],
            observed=obj['observed'],
        )

    def to_dict(self) -> dict:
        return {
            'name': self.name,
            'simulated': self.simulated,
            'observed': self.observed,
        }


@dataclasses.dataclass(frozen=True)
class AvailableResults:
    times: list[float]
    kstpkper: list[(tuple[int, int])]
    number_of_layers: int
    number_of_observations: int
    min_value: float | None = None
    max_value: float | None = None

    @classmethod
    def from_dict(cls, obj):
        return cls(
            times=obj['times'],
            kstpkper=obj['kstpkper'],
            number_of_layers=obj['number_of_layers'],
            number_of_observations=obj['number_of_observations'],
            min_value=obj['min_value'] if 'min_value' in obj and obj['min_value'] is not None else None,
            max_value=obj['max_value'] if 'max_value' in obj and obj['max_value'] is not None else None,
        )

    def to_dict(self) -> dict:
        return {
            'times': self.times,
            'kstpkper': self.kstpkper,
            'number_of_layers': self.number_of_layers,
            'number_of_observations': self.number_of_observations,
            'min_value': self.min_value,
            'max_value': self.max_value,
        }


class CalculationResultType(StrEnum):
    SUCCESS = 'success'
    FAILURE = 'failure'


@dataclasses.dataclass(frozen=True)
class CalculationResult:
    type: CalculationResultType
    message: str
    files: list[str]
    flow_head_results: AvailableResults | None
    flow_drawdown_results: AvailableResults | None
    flow_budget_results: AvailableResults | None
    transport_concentration_results: AvailableResults | None
    transport_budget_results: AvailableResults | None
    packages: list[str]

    @classmethod
    def failure(cls, message: str, files: list[str], packages: list[str] | None = None):
        return cls(
            type=CalculationResultType.FAILURE,
            message=message,
            files=files,
            flow_head_results=None,
            flow_drawdown_results=None,
            flow_budget_results=None,
            transport_concentration_results=None,
            transport_budget_results=None,
            packages=packages or [],
        )

    @classmethod
    def success(
        cls,
        message: str,
        files: list[str],
        flow_head_results: AvailableResults | None = None,
        flow_drawdown_results: AvailableResults | None = None,
        flow_budget_results: AvailableResults | None = None,
        transport_concentration_results: AvailableResults | None = None,
        transport_budget_results: AvailableResults | None = None,
        packages: list[str] | None = None,
    ):
        return cls(
            type=CalculationResultType.SUCCESS,
            message=message if message is not None else '',
            files=files,
            flow_head_results=flow_head_results,
            flow_drawdown_results=flow_drawdown_results,
            flow_budget_results=flow_budget_results,
            transport_concentration_results=transport_concentration_results,
            transport_budget_results=transport_budget_results,
            packages=packages or [],
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            type=CalculationResultType(obj['type']),
            message=obj['message'],
            files=obj['files'],
            flow_head_results=AvailableResults.from_dict(obj['flow_head_results']) if 'flow_head_results' in obj and obj['flow_head_results'] is not None else None,
            flow_drawdown_results=AvailableResults.from_dict(obj['flow_drawdown_results']) if 'flow_drawdown_results' in obj and obj['flow_drawdown_results'] is not None else None,
            flow_budget_results=AvailableResults.from_dict(obj['flow_budget_results']) if 'flow_budget_results' in obj and obj['flow_budget_results'] is not None else None,
            transport_concentration_results=AvailableResults.from_dict(obj['transport_concentration_results']) if 'transport_concentration_results' in obj and obj[
                'transport_concentration_results'] is not None else None,
            transport_budget_results=AvailableResults.from_dict(obj['transport_budget_results']) if 'transport_budget_results' in obj and obj['transport_budget_results'] is not None else None,
            packages=obj['packages'] if 'packages' in obj and obj['packages'] is not None and obj['packages'] != '' else [],
        )

    @classmethod
    def try_from_dict(cls, obj):
        if obj is None:
            return None

        return cls.from_dict(obj)

    def to_dict(self) -> dict:
        return {
            'type': self.type.value,
            'message': self.message if self.message is not None else '',
            'files': self.files if self.files is not None else [],
            'flow_head_results': self.flow_head_results.to_dict() if self.flow_head_results is not None else None,
            'flow_drawdown_results': self.flow_drawdown_results.to_dict() if self.flow_drawdown_results is not None else None,
            'flow_budget_results': self.flow_budget_results.to_dict() if self.flow_budget_results is not None else None,
            'transport_concentration_results': self.transport_concentration_results.to_dict() if self.transport_concentration_results is not None else None,
            'transport_budget_results': self.transport_budget_results.to_dict() if self.transport_budget_results is not None else None,
            'packages': self.packages,
        }
