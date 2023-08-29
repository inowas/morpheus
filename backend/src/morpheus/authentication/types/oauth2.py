import dataclasses
import uuid
from typing import NewType

UserId = NewType('UserId', uuid.UUID)
ClientId = NewType('ClientId', uuid.UUID)


@dataclasses.dataclass(frozen=True)
class PublicClient:
    id: ClientId
    name: str


@dataclasses.dataclass(frozen=True)
class User:
    id: UserId
    email: str
    password_hash: str

    def get_user_id(self):
        return str(self.id)
