import dataclasses


@dataclasses.dataclass(frozen=True)
class LengthUnit:
    UNDEFINED = 0
    FEET = 1
    METERS = 2
    CENTIMETERS = 3

    unit: int

    @classmethod
    def from_int(cls, number: int):
        if number < 0 or number > 3:
            raise ValueError('Length unit integer must be between 0 and 3')
        return cls(unit=number)

    @classmethod
    def from_str(cls, string: str):
        if string == 'undefined':
            return cls(cls.UNDEFINED)
        elif string == 'feet':
            return cls(cls.FEET)
        elif string == 'meters':
            return cls(cls.METERS)
        elif string == 'centimeters':
            return cls(cls.CENTIMETERS)
        else:
            raise ValueError(f'Invalid length unit: {string}')

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value)

    @classmethod
    def meters(cls):
        return cls.from_int(cls.METERS)

    def to_int(self):
        return self.unit

    def to_str(self):
        if self.unit == self.UNDEFINED:
            return 'undefined'
        elif self.unit == self.FEET:
            return 'feet'
        elif self.unit == self.METERS:
            return 'meters'
        elif self.unit == self.CENTIMETERS:
            return 'centimeters'
        else:
            raise ValueError(f'Invalid length unit: {self.unit}')

    def to_value(self):
        return self.to_str()
