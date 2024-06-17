import dataclasses
import uuid


@dataclasses.dataclass(frozen=True)
class Uuid:
    value: str

    def __post_init__(self):
        if len(self.value) == 0:
            raise ValueError('Uuid value cannot be empty')

    def __eq__(self, other):
        return self.value == other.value

    @classmethod
    def new(cls):
        return cls(value=str(uuid.uuid4()))

    @classmethod
    def from_str(cls, value: str):
        return cls(value=value)

    @classmethod
    def try_from_str(cls, value: str | None):
        if value is None:
            return None

        return cls(value=value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value=value)

    def to_str(self) -> str:
        return self.value

    def to_value(self):
        return self.to_str()
