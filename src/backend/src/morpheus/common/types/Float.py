import dataclasses


@dataclasses.dataclass(frozen=True)
class Float:
    value: float

    def __eq__(self, other):
        if isinstance(other, Float):
            return self.value == other.value
        return False

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
