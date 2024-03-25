import dataclasses


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
