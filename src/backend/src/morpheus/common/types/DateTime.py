import dataclasses
from datetime import datetime


@dataclasses.dataclass
class DateTime:
    value: datetime

    def __eq__(self, other):
        return self.value == other.value

    def __lt__(self, other):
        return self.value < other.value

    def __gt__(self, other):
        return self.value > other.value

    def __le__(self, other):
        return self.value <= other.value

    def __ge__(self, other):
        return self.value >= other.value

    @classmethod
    def from_datetime(cls, value: datetime):
        return cls(value=value.replace(tzinfo=None))

    @classmethod
    def from_str(cls, value: str):
        return cls(value=datetime.fromisoformat(value).replace(tzinfo=None))

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value=value)

    def to_datetime(self) -> datetime:
        return self.value

    def to_str(self) -> str:
        return self.value.isoformat()

    def to_value(self) -> str:
        return self.to_str()
