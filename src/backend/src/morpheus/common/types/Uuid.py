import dataclasses
import uuid


@dataclasses.dataclass(frozen=True)
class Uuid:
    value: str

    @classmethod
    def new(cls):
        return cls(value=str(uuid.uuid4()))

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