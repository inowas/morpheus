import dataclasses


@dataclasses.dataclass(frozen=True)
class Bool:
    value: bool

    def __eq__(self, other):
        if isinstance(other, Bool):
            return self.value == other.value
        return False

    @classmethod
    def from_bool(cls, value: bool):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: bool):
        return cls.from_bool(value=value)

    @classmethod
    def yes(cls):
        return cls.from_bool(value=True)

    @classmethod
    def no(cls):
        return cls.from_bool(value=False)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()
