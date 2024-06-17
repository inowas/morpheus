import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.String import NonEmptyString
from morpheus.user.types.User import UserId


@dataclasses.dataclass(frozen=True)
class GroupId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class GroupName(NonEmptyString):
    pass


@dataclasses.dataclass(frozen=True)
class Group:
    group_id: GroupId
    group_name: GroupName
    members: list[UserId]
    admins: list[UserId]

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            group_id=GroupId.from_str(obj['group_id']),
            group_name=GroupName.from_str(obj['group_name']),
            members=[UserId.from_str(member) for member in obj['members']],
            admins=[UserId.from_str(admin) for admin in obj['admins']]
        )

    def to_dict(self):
        return {
            'group_id': self.group_id.to_str(),
            'group_name': self.group_name.to_str(),
            'members': [member.to_str() for member in self.members],
            'admins': [admin.to_str() for admin in self.admins],
        }

