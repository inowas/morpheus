import dataclasses


@dataclasses.dataclass(frozen=True)
class Integer:
    value: int

    def __eq__(self, other):
        if isinstance(other, Integer):
            return self.value == other.value
        return False

    @classmethod
    def from_int(cls, value: int):
        return cls(value=value)

    @classmethod
    def try_from_int(cls, value: int | None):
        if value is None:
            return None

        return cls.from_int(value=value)

    @classmethod
    def from_value(cls, value: int):
        return cls.from_int(value=value)

    def to_int(self) -> int:
        return self.value

    def to_value(self) -> int:
        return self.to_int()
