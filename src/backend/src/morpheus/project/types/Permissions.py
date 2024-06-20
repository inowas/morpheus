import dataclasses
from enum import Enum, StrEnum
from typing import Literal
from morpheus.common.types.identity.Identity import UserId, GroupId


class Visibility(Enum):
    PUBLIC = 'public'
    PRIVATE = 'private'

    @classmethod
    def from_str(cls, visibility: Literal['public', 'private']):
        if visibility == 'public':
            return Visibility.PUBLIC
        elif visibility == 'private':
            return Visibility.PRIVATE
        else:
            raise ValueError(f'Unknown visibility: {visibility}')

    def to_str(self):
        return self.value


class Role(StrEnum):
    OWNER = 'owner'
    ADMIN = 'admin'
    EDITOR = 'editor'
    VIEWER = 'viewer'

    @classmethod
    def from_str(cls, role: str):
        if role == 'owner':
            return Role.OWNER
        elif role == 'admin':
            return Role.ADMIN
        elif role == 'editor':
            return Role.EDITOR
        elif role == 'viewer':
            return Role.VIEWER
        else:
            raise ValueError(f'Unknown role: {role}')

    def to_str(self):
        return self.value


@dataclasses.dataclass(frozen=True)
class MemberCollection:
    members: dict[UserId, Role]

    @classmethod
    def new(cls) -> 'MemberCollection':
        return cls(
            members={}
        )

    @classmethod
    def from_dict(cls, obj: dict) -> 'MemberCollection':
        return cls(
            members={UserId.from_value(user_id): Role.from_str(role) for user_id, role in obj.items()}
        )

    def to_dict(self) -> dict:
        return {
            user_id.to_value(): role.value for user_id, role in self.members.items()
        }

    def with_added_member(self, user_id: UserId, role: Role) -> 'MemberCollection':
        return dataclasses.replace(self, members={**self.members, user_id: role})

    def with_updated_member(self, user_id: UserId, role: Role) -> 'MemberCollection':
        return dataclasses.replace(self, members={**self.members, user_id: role})

    def with_removed_member(self, user_id: UserId) -> 'MemberCollection':
        members = self.members.copy()
        del members[user_id]
        return dataclasses.replace(self, members=members)

    def get_member_role(self, user_id: UserId) -> Role:
        if user_id not in self.members:
            raise ValueError(f'User {user_id} is not a member of this project')
        return self.members[user_id]

    def get_members(self) -> dict[UserId, Role]:
        return self.members

    def has_member(self, user_id: UserId) -> bool:
        return user_id in self.members

    def member_is_admin(self, user_id: UserId) -> bool:
        if user_id not in self.members:
            return False
        try:
            return self.members[user_id] == Role.ADMIN
        except KeyError:
            return False

    def member_is_editor(self, user_id: UserId) -> bool:
        try:
            return self.members[user_id] == Role.EDITOR
        except KeyError:
            return False

    def member_can_manage(self, user_id: UserId) -> bool:
        return self.member_is_admin(user_id)

    def member_can_edit(self, user_id: UserId) -> bool:
        return self.member_is_admin(user_id) or self.member_is_editor(user_id)

    def member_can_view(self, user_id: UserId) -> bool:
        return self.member_is_admin(user_id) or self.member_is_editor(user_id) or self.member_is_viewer(user_id)

    def member_is_viewer(self, user_id: UserId) -> bool:
        try:
            return self.members[user_id] == Role.VIEWER
        except KeyError:
            return False

    def member_can_edit_members_and_permissions(self, user_id: UserId) -> bool:
        return self.member_is_admin(user_id)

    def member_can_edit_metadata(self, user_id: UserId) -> bool:
        return self.member_is_admin(user_id)

    def member_can_edit_visibility(self, user_id: UserId) -> bool:
        return self.member_is_admin(user_id)

    def get_owner_id(self) -> UserId:
        for user_id, role in self.members.items():
            if role == Role.OWNER:
                return user_id
        raise ValueError('No owner found')


@dataclasses.dataclass
class GroupCollection:
    groups: dict[GroupId, Role]

    @classmethod
    def new(cls):
        return cls(
            groups={}
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            groups={GroupId.from_value(group_id): Role.from_str(role) for group_id, role in obj.items()}
        )

    def to_dict(self):
        return {
            group_id.to_value(): role.value for group_id, role in self.groups.items()
        }

    def get_groups(self):
        return self.groups


@dataclasses.dataclass(frozen=True)
class Permissions:
    owner_id: UserId
    groups: GroupCollection
    members: MemberCollection
    visibility: Visibility

    @classmethod
    def new(cls, owner_id: UserId):
        return cls(
            owner_id=owner_id,
            groups=GroupCollection.new(),
            members=MemberCollection.new(),
            visibility=Visibility.PRIVATE
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            owner_id=UserId.from_value(obj['owner_id']),
            groups=GroupCollection.from_dict(obj['groups']),
            members=MemberCollection.from_dict(obj['members']),
            visibility=Visibility.from_str(obj['visibility'])
        )

    def to_dict(self):
        return {
            'owner_id': self.owner_id.to_value(),
            'groups': self.groups.to_dict(),
            'members': self.members.to_dict(),
            'visibility': self.visibility.value
        }

    def member_is_owner(self, user_id: UserId) -> bool:
        return self.owner_id == user_id

    def member_can_manage(self, user_id: UserId) -> bool:
        if self.owner_id == user_id:
            return True
        return self.members.member_can_manage(user_id)

    def member_can_edit(self, user_id: UserId) -> bool:
        if self.owner_id == user_id:
            return True
        return self.members.member_can_edit(user_id)

    def member_can_view(self, user_id: UserId) -> bool:
        if self.owner_id == user_id:
            return True
        return self.members.member_can_view(user_id)

    def with_updated_members(self, members: MemberCollection):
        return dataclasses.replace(self, members=members)

    def with_updated_groups(self, groups: GroupCollection):
        return dataclasses.replace(self, groups=groups)

    def with_updated_owner(self, owner_id: UserId):
        return dataclasses.replace(self, owner_id=owner_id)

    def with_updated_visibility(self, visibility: Visibility):
        return dataclasses.replace(self, visibility=visibility)
