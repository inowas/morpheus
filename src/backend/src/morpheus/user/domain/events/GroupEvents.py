import dataclasses

from morpheus.common.infrastructure.event_sourcing.EventFactory import EventFactory, EventRegistry
from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.common.types.identity.Identity import GroupId, UserId
from morpheus.user.types.Group import Group


class GroupEventName:
    GROUP_CREATED = 'Group Created'
    GROUP_MEMBER_ADDED = 'Group Member Added'
    GROUP_MEMBER_REMOVED = 'Group Member Removed'
    GROUP_ADMIN_ADDED = 'Group Admin Added'
    GROUP_ADMIN_REMOVED = 'Group Admin Removed'


@dataclasses.dataclass(frozen=True)
class GroupEventBase(EventBase):
    def get_group_id(self) -> GroupId:
        return GroupId.from_str(self.entity_uuid.to_str())


@dataclasses.dataclass(frozen=True)
class GroupCreatedEvent(GroupEventBase):
    @classmethod
    def from_group(cls, group: Group, occurred_at: DateTime):
        return cls.create(
            entity_uuid=Uuid.from_str(group.group_id.to_str()),
            occurred_at=occurred_at,
            payload=group.to_dict(),
        )

    def get_group(self) -> Group:
        return Group.from_dict(self.payload)

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_CREATED)


@dataclasses.dataclass(frozen=True)
class MemberAddedEvent(GroupEventBase):
    @classmethod
    def from_user_id(cls, group_id: GroupId, user_id: UserId, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(group_id.to_str()), occurred_at=occurred_at, payload={'user_id': user_id.to_str()})

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_MEMBER_ADDED)


@dataclasses.dataclass(frozen=True)
class MemberRemovedEvent(GroupEventBase):
    @classmethod
    def from_user_id(cls, group_id: GroupId, user_id: UserId, occurred_at: DateTime):
        return cls.create(
            entity_uuid=Uuid.from_str(group_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str(),
            },
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_MEMBER_REMOVED)


@dataclasses.dataclass(frozen=True)
class AdminAddedEvent(GroupEventBase):
    @classmethod
    def from_user_id(cls, group_id: GroupId, user_id: UserId, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(group_id.to_str()), occurred_at=occurred_at, payload={'user_id': user_id.to_str()})

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_ADMIN_ADDED)


@dataclasses.dataclass(frozen=True)
class AdminRemovedEvent(GroupEventBase):
    @classmethod
    def from_user_id(cls, group_id: GroupId, user_id: UserId, occurred_at: DateTime):
        return cls.create(
            entity_uuid=Uuid.from_str(group_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'user_id': user_id.to_str(),
            },
        )

    def get_user_id(self) -> UserId:
        return UserId.from_str(self.payload['user_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GroupEventName.GROUP_ADMIN_REMOVED)


group_event_registry = EventRegistry()
group_event_registry.register_event(GroupCreatedEvent)
group_event_registry.register_event(MemberAddedEvent)
group_event_registry.register_event(MemberRemovedEvent)
group_event_registry.register_event(AdminAddedEvent)
group_event_registry.register_event(AdminRemovedEvent)

group_event_factory = EventFactory(group_event_registry)
