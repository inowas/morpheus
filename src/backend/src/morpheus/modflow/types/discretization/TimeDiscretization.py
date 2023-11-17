import dataclasses
from datetime import datetime

from morpheus.common.types.Bool import Bool


@dataclasses.dataclass
class DateTime:
    value: datetime

    def __eq__(self, other):
        return self.value == other.value

    @classmethod
    def from_datetime(cls, value: datetime):
        return cls(value=value)

    @classmethod
    def from_str(cls, value: str):
        return cls(value=datetime.fromisoformat(value))

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value=value)

    def to_datetime(self) -> datetime:
        return self.value

    def to_str(self) -> str:
        return self.value.isoformat()

    def to_value(self) -> str:
        return self.to_str()


@dataclasses.dataclass(frozen=True)
class TimeUnit:
    UNDEFINED = 0
    SECONDS = 1
    MINUTES = 2
    HOURS = 3
    DAYS = 4
    YEARS = 5

    unit: int

    def __eq__(self, other):
        return self.unit == other.unit

    @classmethod
    def from_int(cls, number: int):
        if number < 0 or number > 5:
            raise ValueError('Time unit integer must be between 0 and 5')
        return cls(unit=number)

    @classmethod
    def from_str(cls, value: str):
        if value not in ['seconds', 'minutes', 'hours', 'days', 'years']:
            raise ValueError('Invalid time unit string')
        return cls.from_int(number=cls.__dict__[value.upper()])

    @classmethod
    def from_value(cls, value: int):
        return cls.from_int(number=value)

    @classmethod
    def from_default(cls):
        return cls.days()

    @classmethod
    def seconds(cls):
        return cls.from_int(cls.SECONDS)

    @classmethod
    def minutes(cls):
        return cls.from_int(cls.MINUTES)

    @classmethod
    def hours(cls):
        return cls.from_int(cls.HOURS)

    @classmethod
    def days(cls):
        return cls.from_int(cls.DAYS)

    @classmethod
    def years(cls):
        return cls.from_int(cls.YEARS)

    def to_int(self) -> int:
        return self.unit

    def to_value(self) -> int:
        return self.to_int()


class StartDateTime(DateTime):
    pass


class EndDateTime(DateTime):
    pass


@dataclasses.dataclass
class NumberOfTimeSteps:
    value: int

    @classmethod
    def from_int(cls, value: int):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: int):
        return cls.from_int(value=value)

    def to_int(self) -> int:
        return self.value

    def to_value(self) -> int:
        return self.to_int()


@dataclasses.dataclass
class TimeStepMultiplier:
    value: float

    @classmethod
    def from_float(cls, value: float):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: float):
        return cls.from_float(value=value)

    def to_float(self) -> float:
        return self.value

    def to_value(self) -> float:
        return self.to_float()


class IsSteadyState(Bool):
    pass


@dataclasses.dataclass
class StressPeriod:
    start_datetime: StartDateTime
    number_of_time_steps: NumberOfTimeSteps
    time_step_multiplier: TimeStepMultiplier
    steady_state: IsSteadyState

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            start_datetime=StartDateTime.from_value(obj['start_datetime']),
            number_of_time_steps=NumberOfTimeSteps.from_value(obj['number_of_time_steps']),
            time_step_multiplier=TimeStepMultiplier.from_value(obj['time_step_multiplier']),
            steady_state=IsSteadyState.from_value(obj['stress_period_type'] == 'steady')
        )

    def to_dict(self):
        return {
            'start_datetime': self.start_datetime.to_value(),
            'number_of_time_steps': self.number_of_time_steps.to_value(),
            'time_step_multiplier': self.time_step_multiplier.to_value(),
            'steady_state': self.steady_state.to_value()
        }


@dataclasses.dataclass
class StressPeriodCollection:
    value: list[StressPeriod]

    def __init__(self, value: list[StressPeriod]):
        self.value = value
        self.value.sort(key=lambda stress_period: stress_period.start_datetime.to_datetime())

    @classmethod
    def new(cls, start_date: StartDateTime):
        return cls(value=[StressPeriod(
            start_datetime=start_date,
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
        return [stress_period.to_dict() for stress_period in self.value]

    def to_value(self) -> list[dict]:
        return self.to_list()

    def __len__(self) -> int:
        return len(self.value)


@dataclasses.dataclass
class TimeDiscretization:
    start_datetime: StartDateTime
    end_datetime: EndDateTime
    stress_periods: StressPeriodCollection
    time_unit: TimeUnit

    def __init__(self, start_date_time: StartDateTime, end_date_time: EndDateTime,
                 stress_periods: StressPeriodCollection,
                 time_unit: TimeUnit):
        self.start_datetime = start_date_time
        self.end_datetime = end_date_time
        self.stress_periods = stress_periods
        self.time_unit = time_unit

        if self.start_datetime.to_datetime() > self.end_datetime.to_datetime():
            raise ValueError('Start date must be before end date')

        if self.stress_periods.value[-1].start_datetime.to_datetime() > self.end_datetime.to_datetime():
            raise ValueError('Last stress period must start before end date')

        if self.stress_periods.value[0].start_datetime.to_datetime() != self.start_datetime.to_datetime():
            raise ValueError('First stress period must start at start date')

    @classmethod
    def new(cls):
        start_datetime = StartDateTime.from_str('2020-01-01T00:00:00+00:00')
        end_datetime = EndDateTime.from_str('2020-01-02T00:00:00+00:00')
        return TimeDiscretization(
            start_date_time=start_datetime,
            end_date_time=end_datetime,
            stress_periods=StressPeriodCollection.new(start_date=start_datetime),
            time_unit=TimeUnit.days()
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            start_date_time=StartDateTime.from_value(obj['start_datetime']),
            end_date_time=EndDateTime.from_value(obj['end_datetime']),
            stress_periods=StressPeriodCollection.from_value(obj['stress_periods']),
            time_unit=TimeUnit.from_value(obj['time_unit'])
        )

    def to_dict(self):
        return {
            'start_datetime': self.start_datetime.to_value(),
            'end_datetime': self.end_datetime.to_value(),
            'stress_periods': self.stress_periods.to_value(),
            'time_unit': self.time_unit.to_value()
        }

    def number_of_stress_periods(self):
        return len(self.stress_periods)

    def time_unit_length_in_seconds(self):
        if self.time_unit == TimeUnit.seconds():
            return 1
        if self.time_unit == TimeUnit.minutes():
            return 60
        if self.time_unit == TimeUnit.hours():
            return 3600
        if self.time_unit == TimeUnit.days():
            return 86400
        if self.time_unit == TimeUnit.years():
            return 31536000

        raise ValueError('Invalid time unit')

    def stress_period_lengths(self):
        for idx, stress_period in enumerate(self.stress_periods.value):
            if idx == 0:
                continue
            yield (stress_period.start_datetime.to_datetime() - self.stress_periods.value[idx - 1]
                   .start_datetime.to_datetime()).total_seconds() / self.time_unit_length_in_seconds()

    def number_of_time_steps(self):
        return [stress_period.number_of_time_steps.value for stress_period in self.stress_periods.value]

    def time_step_multipliers(self):
        return [stress_period.time_step_multiplier.value for stress_period in self.stress_periods.value]

    def stress_period_types(self):
        return [stress_period.steady_state == IsSteadyState.yes() for stress_period in
                self.stress_periods.value]
