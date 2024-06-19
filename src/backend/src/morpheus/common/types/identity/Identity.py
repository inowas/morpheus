import dataclasses

from morpheus.common.types import Uuid


@dataclasses.dataclass(frozen=True)
class UserId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class Identity:
    user_id: UserId
    is_admin: bool

    @staticmethod
    def try_from_dict(obj: dict | None):
        if obj is None:
            return None

        return Identity(
            user_id=UserId.from_str(obj['user_id']),
            is_admin=obj['is_admin'],
        )

    @staticmethod
    def from_dict(obj: dict) -> 'Identity':
        return Identity(
            user_id=UserId.from_str(obj['user_id']),
            is_admin=obj['is_admin'],
        )

    def to_dict(self) -> dict:
        return {
            'user_id': self.user_id.to_str(),
            'is_admin': self.is_admin,
        }
