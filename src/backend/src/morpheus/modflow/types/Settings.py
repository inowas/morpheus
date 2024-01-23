import dataclasses
from enum import Enum
from typing import Literal

from morpheus.common.types import String
from morpheus.modflow.types.Group import GroupId
from morpheus.modflow.types.User import UserId


class Name(String):
    pass


class Description(String):
    pass


@dataclasses.dataclass
class Tags:
    value: list[str]

    @classmethod
    def from_list(cls, value: list[str]):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: list[str]):
        return cls.from_list(value=value)

    def to_list(self):
        return self.value

    def to_value(self):
        return self.to_list()


@dataclasses.dataclass
class Metadata:
    name: Name
    description: Description
    tags: Tags

    @classmethod
    def new(cls):
        return cls(
            name=Name('New Model'),
            description=Description('New Model description'),
            tags=Tags([])
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            name=Name.from_value(obj['name']),
            description=Description.from_value(obj['description']),
            tags=Tags.from_value(obj['tags']),
        )

    def to_dict(self):
        return {
            'name': self.name.to_value(),
            'description': self.description.to_value(),
            'tags': self.tags.to_value(),
        }

    def with_updated_name(self, name: Name):
        return dataclasses.replace(self, name=name)

    def with_updated_description(self, description: Description):
        return dataclasses.replace(self, description=description)

    def with_updated_tags(self, tags: Tags):
        return dataclasses.replace(self, tags=tags)


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


class Role(Enum):
    OWNER = 'owner'
    ADMIN = 'admin'
    EDITOR = 'editor'
    VIEWER = 'viewer'

    @classmethod
    def from_str(cls, role: Literal['owner', 'admin', 'editor', 'viewer']):
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


@dataclasses.dataclass(frozen=True)
class MemberCollection:
    members: dict[UserId, Role]

    @classmethod
    def new(cls, user_id: UserId) -> 'MemberCollection':
        return cls(
            members={user_id: Role.OWNER}
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

    def member_is_owner(self, user_id: UserId) -> bool:
        return self.members[user_id] == Role.OWNER

    def member_is_admin(self, user_id: UserId) -> bool:
        return self.members[user_id] == Role.ADMIN

    def member_is_editor(self, user_id: UserId) -> bool:
        return self.members[user_id] == Role.EDITOR

    def member_is_viewer(self, user_id: UserId) -> bool:
        return self.members[user_id] == Role.VIEWER

    def member_is_admin_or_owner(self, user_id: UserId) -> bool:
        return self.member_is_admin(user_id) or self.member_is_owner(user_id)

    def member_can_edit_members_and_permissions(self, user_id: UserId) -> bool:
        return self.member_is_admin_or_owner(user_id)

    def member_can_edit_metadata(self, user_id: UserId) -> bool:
        return self.member_is_admin_or_owner(user_id)

    def member_can_edit_visibility(self, user_id: UserId) -> bool:
        return self.member_is_admin_or_owner(user_id)

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


@dataclasses.dataclass(frozen=True)
class Settings:
    groups: GroupCollection
    members: MemberCollection
    metadata: Metadata
    visibility: Visibility

    @classmethod
    def new(cls, user_id: UserId):
        return cls(
            groups=GroupCollection.new(),
            members=MemberCollection.new(user_id=user_id),
            metadata=Metadata.new(),
            visibility=Visibility.PRIVATE
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            groups=GroupCollection.from_dict(obj['groups']),
            members=MemberCollection.from_dict(obj['members']),
            metadata=Metadata.from_dict(obj['metadata']),
            visibility=Visibility.from_str(obj['visibility'])
        )

    def to_dict(self):
        return {
            'groups': self.groups.to_dict(),
            'members': self.members.to_dict(),
            'metadata': self.metadata.to_dict(),
            'visibility': self.visibility.value
        }

    def with_updated_members(self, members: MemberCollection):
        return dataclasses.replace(self, members=members)

    def with_updated_metadata(self, metadata: Metadata):
        return dataclasses.replace(self, metadata=metadata)

    def with_updated_visibility(self, visibility: Visibility):
        return dataclasses.replace(self, visibility=visibility)
