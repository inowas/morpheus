import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.project.types.Project import ProjectId
from morpheus.project.types.Permissions import Role, Visibility
from morpheus.common.types.identity.Identity import UserId

from .PermissionEventName import PermissionEventName


@dataclasses.dataclass(frozen=True)
class MemberAddedEvent(EventBase):
    @classmethod
    def from_user_id_and_role(cls, project_id: ProjectId, user_id: UserId, role: Role, occurred_at: DateTime):
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str(),
                'role': role.to_str()
            }
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    def get_role(self) -> Role:
        return Role.from_str(self.payload['role'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(PermissionEventName.PROJECT_MEMBER_ADDED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class MemberRemovedEvent(EventBase):
    @classmethod
    def from_user_id(cls, project_id: ProjectId, user_id: UserId, occurred_at: DateTime):
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str(),
            }
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(PermissionEventName.PROJECT_MEMBER_REMOVED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class MemberRoleUpdatedEvent(EventBase):
    @classmethod
    def from_user_id_and_role(cls, project_id: ProjectId, user_id: UserId, new_role: Role, occurred_at: DateTime):
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str(),
                'role': new_role.to_str()
            }
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    def get_role(self) -> Role:
        return Role.from_str(self.payload['role'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(PermissionEventName.PROJECT_MEMBER_ROLE_UPDATED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class OwnershipUpdatedEvent(EventBase):
    @classmethod
    def from_old_and_new_owner(cls, project_id: ProjectId, old_owner: UserId, new_owner: UserId, occurred_at: DateTime):
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'old_owner_id': old_owner.to_str(),
                'new_owner_id': new_owner.to_str(),
            }
        )

    def get_old_owner_id(self) -> UserId:
        return UserId.from_str(self.payload['old_owner_id'])

    def get_new_owner_id(self) -> UserId:
        return UserId.from_str(self.payload['new_owner_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(PermissionEventName.PROJECT_OWNERSHIP_UPDATED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class VisibilityUpdatedEvent(EventBase):
    @classmethod
    def from_visibility(cls, project_id: ProjectId, visibility: Visibility, occurred_at: DateTime):
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'visibility': visibility.to_str()
            }
        )

    def get_visibility(self) -> Visibility:
        return Visibility.from_str(self.payload['visibility'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(PermissionEventName.PROJECT_VISIBILITY_UPDATED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())
