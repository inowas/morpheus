import dataclasses
from enum import Enum
from typing import Literal

from morpheus.modflow.types.User import UserId


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
    MEMBER = 'member'
    OBSERVER = 'observer'
    VIEWER = 'viewer'

    @classmethod
    def from_str(cls, role: Literal['owner', 'admin', 'member', 'observer', 'viewer']):
        if role == 'owner':
            return Role.OWNER
        elif role == 'admin':
            return Role.ADMIN
        elif role == 'member':
            return Role.MEMBER
        elif role == 'observer':
            return Role.OBSERVER
        elif role == 'viewer':
            return Role.VIEWER
        else:
            raise ValueError(f'Unknown role: {role}')


@dataclasses.dataclass(frozen=True)
class Permissions:
    owner_id: UserId
    admin_ids: list[UserId]
    editor_ids: list[UserId]
    observer_ids: list[UserId]
    visibility: Visibility

    @classmethod
    def new(cls, created_by: UserId):
        return cls(
            owner_id=created_by,
            admin_ids=[],
            editor_ids=[],
            observer_ids=[],
            visibility=Visibility.PRIVATE
        )

    @classmethod
    def from_dict(cls, obj):
        return cls(
            owner_id=UserId.from_value(obj['owner_id']),
            admin_ids=[UserId.from_value(user_id) for user_id in obj['admin_ids']],
            editor_ids=[UserId.from_value(user_id) for user_id in obj['editor_ids']],
            observer_ids=[UserId.from_value(user_id) for user_id in obj['observer_ids']],
            visibility=Visibility.from_str(obj['visibility'])
        )

    def __dict__(self):
        return {
            'owner_id': self.owner_id.to_value(),
            'admin_ids': [user_id.to_value() for user_id in self.admin_ids],
            'editor_ids': [user_id.to_value() for user_id in self.editor_ids],
            'observer_ids': [user_id.to_value() for user_id in self.observer_ids],
            'visibility': self.visibility.to_str()
        }

    def get_role(self, user_id: UserId) -> Role | None:
        if user_id == self.owner_id:
            return Role.OWNER

        if user_id in self.admin_ids:
            return Role.ADMIN

        if user_id in self.editor_ids:
            return Role.MEMBER

        if user_id in self.observer_ids:
            return Role.OBSERVER

        if self.visibility == Visibility.PUBLIC:
            return Role.VIEWER

        return None

    def user_can_view(self, user_id: UserId):
        return (
            self.visibility == Visibility.PUBLIC or user_id in self.observer_ids or user_id in self.editor_ids
            or user_id in self.admin_ids or user_id == self.owner_id
        )

    def user_can_edit(self, user_id: UserId):
        return user_id in self.editor_ids or user_id in self.admin_ids or user_id == self.owner_id

    def user_can_delete(self, user_id: UserId):
        return user_id in self.admin_ids or user_id == self.owner_id

    def user_can_manage_owner_permissions(self, user_id: UserId):
        return user_id == self.owner_id

    def user_can_manage_permissions(self, user_id: UserId):
        return user_id in self.admin_ids or user_id == self.owner_id

    def user_can_manage_visibility(self, user_id: UserId):
        return user_id in self.admin_ids or user_id == self.owner_id

    def with_updated_owner(self, user_id: UserId):
        return dataclasses.replace(self, owner_id=user_id)

    def with_added_admin(self, user_id: UserId):
        admin_ids = self.admin_ids + [user_id] if user_id not in self.admin_ids else self.admin_ids
        return dataclasses.replace(self, admin_ids=admin_ids)

    def with_removed_admin(self, user_id: UserId):
        return dataclasses.replace(self, admin_ids=[admin for admin in self.admin_ids if admin != user_id])

    def with_added_editor(self, user_id: UserId):
        editor_ids = self.editor_ids + [user_id] if user_id not in self.editor_ids else self.editor_ids
        return dataclasses.replace(self, editor_ids=editor_ids)

    def with_removed_editor(self, user_id: UserId):
        editor_ids = [editor for editor in self.editor_ids if editor != user_id]
        return dataclasses.replace(self, editor_ids=editor_ids)

    def with_added_observer(self, user_id: UserId):
        observer_ids = self.observer_ids + [user_id] if user_id not in self.observer_ids else self.observer_ids
        return dataclasses.replace(self, observer_ids=observer_ids)

    def with_removed_observer(self, user_id: UserId):
        observer_ids = [observer_id for observer_id in self.observer_ids if observer_id != user_id]
        return dataclasses.replace(self, observer_ids=observer_ids)

    def with_updated_visibility(self, visibility: Visibility):
        return dataclasses.replace(self, visibility=visibility)

    def to_dict(self):
        self.__dict__()
