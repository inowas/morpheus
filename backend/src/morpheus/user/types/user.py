import uuid
import dataclasses
from typing import NewType

UserId = NewType('UserId', uuid.UUID)


@dataclasses.dataclass(frozen=True)
class User:
    id: UserId
    email: str
    password_hash: str

    @classmethod
    def new(cls, email: str, password_hash: str):
        return cls(id=UserId(uuid.uuid4()), email=email, password_hash=password_hash)

    @classmethod
    def from_dict(cls, d):
        return cls(**d)

    def to_dict(self):
        return dataclasses.asdict(self)
