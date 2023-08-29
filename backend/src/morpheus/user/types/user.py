import uuid
import dataclasses
from typing import NewType

UserId = NewType('UserId', uuid.UUID)


@dataclasses.dataclass(frozen=True)
class User:
    id: UserId
    email: str
    password_hash: str

    def __post_init__(self):
        if len(str(self.id)) != 36:
            raise ValueError('User id must be a uuid of length 36')
        if len(self.email) <= 0 or len(self.email) > 255:
            raise ValueError('User email must not be empty and have a maximum of 255 characters')
        if len(self.password_hash) <= 0 or len(self.password_hash) > 255:
            raise ValueError('User password_hash must not be empty and have a maximum of 255 characters')

    @classmethod
    def new(cls, email: str, password_hash: str):
        return cls(id=UserId(uuid.uuid4()), email=email, password_hash=password_hash)
