import dataclasses

from morpheus.common.types import DateTime, Integer, Float, Bool


class StartDateTime(DateTime):
    pass


class EndDateTime(DateTime):
    pass


class NumberOfTimeSteps(Integer):
    pass


class TimeStepMultiplier(Float):
    pass


class IsSteadyState(Bool):
    pass


@dataclasses.dataclass
class StressPeriod:
    start_date_time: StartDateTime
    number_of_time_steps: NumberOfTimeSteps
    time_step_multiplier: TimeStepMultiplier
    steady_state: IsSteadyState

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            start_date_time=StartDateTime.from_value(obj['start_datetime']),
            number_of_time_steps=NumberOfTimeSteps.from_value(obj['number_of_time_steps']),
            time_step_multiplier=TimeStepMultiplier.from_value(obj['time_step_multiplier']),
            steady_state=IsSteadyState.from_value(obj['steady_state'])
        )

    def to_dict(self):
        return {
            'start_datetime': self.start_date_time.to_value(),
            'number_of_time_steps': self.number_of_time_steps.to_value(),
            'time_step_multiplier': self.time_step_multiplier.to_value(),
            'steady_state': self.steady_state.to_value()
        }


@dataclasses.dataclass
class StressPeriodCollection:
    values: list[StressPeriod]

    def __init__(self, value: list[StressPeriod]):
        self.values = value
        self.values.sort(key=lambda stress_period: stress_period.start_date_time.to_datetime())

    def __iter__(self):
        return iter(self.values)

    def __len__(self) -> int:
        return len(self.values)

    @classmethod
    def new(cls, start_date: StartDateTime):
        return cls(value=[StressPeriod(
            start_date_time=start_date,
            number_of_time_steps=NumberOfTimeSteps.from_int(1),
            time_step_multiplier=TimeStepMultiplier.from_float(1.0),
            steady_state=IsSteadyState.yes()
        )])

    @classmethod
    def from_list(cls, value: list[dict]):
        return cls(value=[StressPeriod.from_dict(obj=stress_period) for stress_period in value])

    @classmethod
    def from_value(cls, value: list[dict]):
        return cls.from_list(value=value)

    def to_list(self) -> list[dict]:
        return [stress_period.to_dict() for stress_period in self.values]

    def to_value(self) -> list[dict]:
        return self.to_list()

    def number_of_time_steps(self):
        return [stress_period.number_of_time_steps.value for stress_period in self.values]

    def time_step_multipliers(self):
        return [stress_period.time_step_multiplier.value for stress_period in self.values]

    def stress_period_types(self):
        return [stress_period.steady_state == IsSteadyState.yes() for stress_period in self.values]
