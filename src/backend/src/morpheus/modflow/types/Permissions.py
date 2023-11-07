import dataclasses
from typing import Literal

from morpheus.modflow.types.User import UserId


@dataclasses.dataclass
class Visibility:
    value: Literal['public', 'private']

    @classmethod
    def from_str(cls, value: str):
        if value.lower() == 'public':
            return cls(value='public')

        if value.lower() == 'private':
            return cls(value='private')

        raise ValueError('Visibility must be either public or private')

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value=value)

    @classmethod
    def private(cls):
        return cls(value='private')

    @classmethod
    def public(cls):
        return cls(value='public')

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass(frozen=True)
class Permissions:
    admin: list[UserId]
    read: list[UserId]
    read_write: list[UserId]
    visibility: Visibility

    @classmethod
    def new(cls, creator_id: UserId):
        return cls(
            admin=[creator_id],
            read=[],
            read_write=[],
            visibility=Visibility.from_str('private')
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            admin=[UserId.from_value(user_id) for user_id in obj['admin']],
            read=[UserId.from_value(user_id) for user_id in obj['read']],
            read_write=[UserId.from_value(user_id) for user_id in obj['read_write']],
            visibility=Visibility.from_value(obj['visibility'])
        )

    def __dict__(self):
        return {
            'admin': [user_id.to_value() for user_id in self.admin],
            'read': [user_id.to_value() for user_id in self.read],
            'read_write': [user_id.to_value() for user_id in self.read_write],
            'visibility': self.visibility.to_value()
        }

    def to_dict(self):
        self.__dict__()
