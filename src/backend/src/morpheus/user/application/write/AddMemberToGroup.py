import dataclasses

from morpheus.common.types import DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.Exceptions import NotFoundException
from morpheus.common.types.identity.Identity import GroupId, UserId
from morpheus.user.application.read.GroupReader import group_reader
from morpheus.user.domain.events.GroupEvents import MemberAddedEvent
from morpheus.user.infrastructure.event_sourcing.GroupEventBus import group_event_bus


@dataclasses.dataclass(frozen=True)
class AddMembersToGroupCommand:
    group_id: GroupId
    members: set[UserId]
    creator_id: UserId


class AddMembersToGroupCommandHandler:
    @classmethod
    def handle(cls, command: AddMembersToGroupCommand):
        group = group_reader.get_group(command.group_id)
        if group is None:
            raise NotFoundException(f'Group with id {command.group_id} not found')

        current_members = group.members
        new_members = command.members.difference(current_members)

        for member in new_members:
            event_envelope = EventEnvelope(
                event=MemberAddedEvent.from_user_id(command.group_id, member, DateTime.now()),
                metadata=EventMetadata.with_creator(command.creator_id),
            )
            group_event_bus.record(event_envelope)
