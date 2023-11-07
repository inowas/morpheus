import dataclasses
import uuid


@dataclasses.dataclass
class UserId:
    value: str

    @classmethod
    def from_str(cls, value: str):
        try:
            uuid.UUID(value)
        except ValueError:
            raise ValueError('User ID must be a valid UUID')
        return cls(value=value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value=value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()
