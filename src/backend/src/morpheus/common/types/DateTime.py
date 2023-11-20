import dataclasses
from datetime import datetime


@dataclasses.dataclass
class DateTime:
    value: datetime

    def __eq__(self, other):
        return self.value == other.values

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
