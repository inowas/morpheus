import dataclasses


@dataclasses.dataclass(frozen=True)
class String:
    value: str

    def __eq__(self, other):
        return self.value == other.value

    @classmethod
    def try_from_str(cls, value: str | None):
        if value is None:
            return None

        return cls.from_str(value=value)

    @classmethod
    def from_str(cls, value: str):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value=value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()

    def to_lower(self):
        return self.value.lower()
