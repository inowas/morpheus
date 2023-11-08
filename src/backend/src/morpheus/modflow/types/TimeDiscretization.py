import dataclasses

from datetime import datetime


@dataclasses.dataclass(frozen=True)
class TimeUnit:
    UNDEFINED = 0
    SECONDS = 1
    MINUTES = 2
    HOURS = 3
    DAYS = 4
    YEARS = 5

    unit: int

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
    def days(cls):
        return cls.from_int(cls.DAYS)

    @classmethod
    def hours(cls):
        return cls.from_int(cls.HOURS)

    def to_int(self) -> int:
        return self.unit

    def to_value(self) -> int:
        return self.to_int()


@dataclasses.dataclass(frozen=True)
class StressPeriodType:
    STEADY = 'STEADY'
    TRANSIENT = 'TRANSIENT'
    value: str

    @classmethod
    def steady(cls):
        return cls(value=cls.STEADY)

    @classmethod
    def transient(cls):
        return cls(value=cls.TRANSIENT)

    def is_steady(self):
        return self.value == self.STEADY

    def is_transient(self):
        return self.value == self.TRANSIENT

    @classmethod
    def from_str(cls, value: str):
        if value not in [cls.STEADY, cls.TRANSIENT]:
            raise ValueError('Invalid stress period type')

        return cls(value=value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value=value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass
class StressPeriodLength:
    value: int

    @classmethod
    def from_int(cls, value: int):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: int):
        return cls.from_int(value=int(value))

    def to_int(self) -> int:
        return self.value

    def to_value(self) -> int:
        return self.to_int()


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


@dataclasses.dataclass
class StressPeriodCollection:
    stress_periods: list['StressPeriod']

    @classmethod
    def from_list(cls, collection: list):
        return cls(stress_periods=[StressPeriod.from_dict(sp) for sp in collection])

    @classmethod
    def from_value(cls, value: list):
        return cls.from_list(collection=value)

    def to_list(self) -> list:
        return [sp.to_dict() for sp in self.stress_periods]

    def to_value(self) -> list:
        return self.to_list()


@dataclasses.dataclass
class StressPeriod:
    stress_period_type: StressPeriodType
    length: StressPeriodLength
    number_of_time_steps: NumberOfTimeSteps
    time_step_multiplier: TimeStepMultiplier

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            stress_period_type=StressPeriodType.from_value(obj['stress_period_type']),
            length=StressPeriodLength.from_value(obj['length']),
            number_of_time_steps=NumberOfTimeSteps.from_value(obj['number_of_time_steps']),
            time_step_multiplier=TimeStepMultiplier.from_value(obj['time_step_multiplier'])
        )

    def to_dict(self):
        return {
            'stress_period_type': self.stress_period_type.to_value(),
            'length': self.length.to_value(),
            'number_of_time_steps': self.number_of_time_steps.to_value(),
            'time_step_multiplier': self.time_step_multiplier.to_value()
        }


@dataclasses.dataclass
class StartDateTime:
    value: datetime

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


@dataclasses.dataclass
class TimeDiscretization:
    start_datetime: StartDateTime
    stress_periods: StressPeriodCollection
    time_unit: TimeUnit

    @classmethod
    def new(cls):
        return TimeDiscretization(
            start_datetime=StartDateTime.from_str('2020-01-01T00:00:00+00:00'),
            stress_periods=StressPeriodCollection.from_list([{
                'stress_period_type': 'STEADY',
                'length': 1,
                'number_of_time_steps': 1,
                'time_step_multiplier': 1
            }]),
            time_unit=TimeUnit.days()
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            start_datetime=StartDateTime.from_value(obj['start_datetime']),
            stress_periods=StressPeriodCollection.from_value(value=obj['stress_periods']),
            time_unit=TimeUnit.from_value(obj['time_unit'])
        )

    def to_dict(self):
        return {
            'start_datetime': self.start_datetime.to_str(),
            'stress_periods': self.stress_periods.to_list(),
            'time_unit': self.time_unit.to_value()
        }
