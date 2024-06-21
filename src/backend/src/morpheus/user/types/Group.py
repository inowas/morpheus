import dataclasses
from morpheus.common.types.String import NonEmptyString
from morpheus.common.types.identity.Identity import UserId, GroupId


@dataclasses.dataclass(frozen=True)
class GroupName(NonEmptyString):
    pass


@dataclasses.dataclass(frozen=True)
class Group:
    group_id: GroupId
    group_name: GroupName
    members: set[UserId]
    admins: set[UserId]

    @staticmethod
    def empty(group_id: GroupId, group_name: GroupName) -> 'Group':
        return Group(
            group_id=group_id,
            group_name=group_name,
            members=set(),
            admins=set(),
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            group_id=GroupId.from_str(obj['group_id']),
            group_name=GroupName.from_str(obj['group_name']),
            members=set([UserId.from_str(member) for member in obj['members']]),
            admins=set([UserId.from_str(admin) for admin in obj['admins']])
        )

    def to_dict(self):
        return {
            'group_id': self.group_id.to_str(),
            'group_name': self.group_name.to_str(),
            'members': [member.to_str() for member in self.members],
            'admins': [admin.to_str() for admin in self.admins],
        }

    def with_member(self, user_id: UserId) -> 'Group':
        new_members = self.members.copy()
        new_members.add(user_id)
        return dataclasses.replace(self, members=new_members)

    def without_member(self, user_id: UserId) -> 'Group':
        new_members = self.members.copy()
        new_members.discard(user_id)
        return dataclasses.replace(self, members=new_members)

    def with_admin(self, user_id: UserId) -> 'Group':
        new_admins = self.admins.copy()
        new_admins.add(user_id)
        return dataclasses.replace(self, admins=new_admins)

    def without_admin(self, user_id: UserId) -> 'Group':
        new_admins = self.admins.copy()
        new_admins.discard(user_id)
        return dataclasses.replace(self, admins=new_admins)
