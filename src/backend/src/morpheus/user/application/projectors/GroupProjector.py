from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventListenerBase, listen_to
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.user.domain.events.GroupEvents import AdminAddedEvent, AdminRemovedEvent, GroupCreatedEvent, MemberAddedEvent, MemberRemovedEvent
from morpheus.user.infrastructure.persistence.GroupRepository import GroupRepository, group_repository


class GroupProjector(EventListenerBase):
    def __init__(self, group_repository: GroupRepository) -> None:
        self.group_repository = group_repository

    @listen_to(GroupCreatedEvent)
    def on_group_created(self, event: GroupCreatedEvent, metadata: EventMetadata) -> None:
        self.group_repository.add_group(event.get_group())

    @listen_to(MemberAddedEvent)
    def on_member_added(self, event: MemberAddedEvent, metadata: EventMetadata) -> None:
        self.group_repository.add_member_to_group(event.get_group_id(), event.get_user_id())

    @listen_to(MemberRemovedEvent)
    def on_member_removed(self, event: MemberRemovedEvent, metadata: EventMetadata) -> None:
        self.group_repository.remove_member_from_group(event.get_group_id(), event.get_user_id())

    @listen_to(AdminAddedEvent)
    def on_admin_added(self, event: AdminAddedEvent, metadata: EventMetadata) -> None:
        self.group_repository.add_admin_to_group(event.get_group_id(), event.get_user_id())

    @listen_to(AdminRemovedEvent)
    def on_admin_removed(self, event: AdminRemovedEvent, metadata: EventMetadata) -> None:
        self.group_repository.remove_admin_from_group(event.get_group_id(), event.get_user_id())


group_projector = GroupProjector(group_repository)
