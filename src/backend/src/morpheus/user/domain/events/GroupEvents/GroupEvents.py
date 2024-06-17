import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.user.types.Group import GroupId, Group
from morpheus.user.types.User import UserId

from .GroupEventName import GroupEventName


@dataclasses.dataclass(frozen=True)
class GroupCreatedEvent(EventBase):
    @classmethod
    def from_group(cls, group: Group, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(group.group_id.to_str()),
            occurred_at=occurred_at,
            payload=group.to_dict(),
        )

    def get_group(self) -> Group:
        return Group.from_dict(self.payload)

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_CREATED.to_str())

    def get_group_id(self) -> GroupId:
        return GroupId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class MemberAddedEvent(EventBase):
    @classmethod
    def from_user_id(cls, group_id: GroupId, user_id: UserId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(group_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str()
            }
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_MEMBER_ADDED.to_str())

    def get_group_id(self) -> GroupId:
        return GroupId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class MemberRemovedEvent(EventBase):
    @classmethod
    def from_user_id(cls, group_id: GroupId, user_id: UserId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(group_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str(),
            }
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_MEMBER_REMOVED.to_str())

    def get_group_id(self) -> GroupId:
        return GroupId.from_str(self.entity_uuid.to_str())

@dataclasses.dataclass(frozen=True)
class AdminAddedEvent(EventBase):
    @classmethod
    def from_user_id(cls, group_id: GroupId, user_id: UserId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(group_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str()
            }
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_ADMIN_ADDED.to_str())

    def get_group_id(self) -> GroupId:
        return GroupId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class AdminRemovedEvent(EventBase):
    @classmethod
    def from_user_id(cls, group_id: GroupId, user_id: UserId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(group_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str(),
            }
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_ADMIN_REMOVED.to_str())

    def get_group_id(self) -> GroupId:
        return GroupId.from_str(self.entity_uuid.to_str())
