import dataclasses

from morpheus.common.types import DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.user.domain.events.GroupEvents import GroupCreatedEvent
from morpheus.user.infrastructure.event_sourcing.GroupEventBus import group_event_bus
from morpheus.user.types.Group import GroupId, Group, GroupName
from morpheus.user.types.User import UserId


@dataclasses.dataclass(frozen=True)
class CreateGroupCommand:
    group_id: GroupId
    name: GroupName
    creator_id: UserId


class CreateGroupCommandHandler:
    @classmethod
    def handle(cls, command: CreateGroupCommand):
        group = Group.empty(
            group_id=command.group_id,
            group_name=command.name,
        )

        event_envelope = EventEnvelope(
            event=GroupCreatedEvent.from_group(group, DateTime.now()),
            metadata=EventMetadata.with_creator(command.creator_id),
        )
        group_event_bus.record(event_envelope)
