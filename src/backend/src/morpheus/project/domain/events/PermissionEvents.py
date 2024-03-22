import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.project.domain.events.ProjectEventName import ProjectEventName
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.Permissions import Role, Visibility
from morpheus.project.types.User import UserId


@dataclasses.dataclass(frozen=True)
class MemberAddedEvent(EventBase):
    @classmethod
    def from_user_id_and_role(cls, project_id: ProjectId, user_id: UserId, role: Role = Role.VIEWER, occurred_at=DateTime.now()):
        return cls(
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

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MEMBER_ADDED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class MemberRemovedEvent(EventBase):
    @classmethod
    def from_user_id(cls, project_id: ProjectId, user_id: UserId, occurred_at=DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str(),
            }
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MEMBER_REMOVED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class MemberRoleUpdatedEvent(EventBase):
    @classmethod
    def from_user_id_and_role(cls, project_id: ProjectId, user_id: UserId, role: Role, occurred_at=DateTime.now()):
        return cls(
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

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MEMBER_ROLE_UPDATED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class VisibilityUpdatedEvent(EventBase):
    @classmethod
    def from_visibility(cls, project_id: ProjectId, visibility: Visibility, occurred_at=DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'visibility': visibility.to_str()
            }
        )

    def get_visibility(self) -> Visibility:
        return Visibility.from_str(self.payload['visibility'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VISIBILITY_UPDATED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class OwnershipUpdatedEvent(EventBase):
    @classmethod
    def from_user_id(cls, project_id: ProjectId, user_id: UserId, occurred_at=DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'owner_id': user_id.to_str(),
            }
        )

    def get_owner_id(self) -> UserId:
        return UserId.from_str(self.payload['owner_id'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.OWNERSHIP_UPDATED.to_str())

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())
