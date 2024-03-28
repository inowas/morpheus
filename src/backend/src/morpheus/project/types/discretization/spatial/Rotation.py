import dataclasses


@dataclasses.dataclass
class Rotation(float):
    value: float

    def __init__(self, value: float):
        if value < -90 or value > 90:
            raise ValueError('Rotation must be between -90 and 90')
        self.value = value

    @classmethod
    def from_float(cls, number: float):
        return cls(number)

    @classmethod
    def from_value(cls, value: float):
        return cls.from_float(value)

    def to_float(self):
        return self.value

    def to_value(self):
        return self.to_float()
