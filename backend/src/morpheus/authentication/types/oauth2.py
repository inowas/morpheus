import dataclasses
import uuid
from typing import NewType

ClientId = NewType('ClientId', uuid.UUID)


@dataclasses.dataclass(frozen=True)
class PublicClient:
    id: ClientId
    name: str

    @classmethod
    def new(cls, name: str):
        return cls(id=ClientId(uuid.uuid4()), name=name)
