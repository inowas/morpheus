import dataclasses
from typing import Generic, TypeVar

T = TypeVar('T')


@dataclasses.dataclass
class Message(Generic[T]):
    uuid: str
    message_name: str
    metadata: dict
    payload: T
