from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ...domain.events.ProjectEvents import ProjectCreatedEvent
from ...domain.events.PermissionEvents import MemberAddedEvent, MemberRemovedEvent, MemberRoleUpdatedEvent, OwnershipUpdatedEvent, VisibilityUpdatedEvent
from ...infrastructure.persistence.PermissionsProjection import permissions_projection, PermissionsProjection


class PermissionsProjector(EventListenerBase):

    def __init__(self, repository: PermissionsProjection):
        self.repository = repository

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata):
        permissions = event.get_project().permissions
        self.repository.save_permissions(project_id=event.get_project_id(), permissions=permissions)

    @listen_to(MemberAddedEvent)
    def on_member_added(self, event: MemberAddedEvent, metadata: EventMetadata):
        self.repository.add_member(project_id=event.get_project_id(), user_id=event.get_user_id(), role=event.get_role())

    @listen_to(MemberRemovedEvent)
    def on_member_removed(self, event: MemberRemovedEvent, metadata: EventMetadata):
        self.repository.remove_member(project_id=event.get_project_id(), user_id=event.get_user_id())

    @listen_to(MemberRoleUpdatedEvent)
    def on_member_role_updated(self, event: MemberRoleUpdatedEvent, metadata: EventMetadata):
        self.repository.update_member(project_id=event.get_project_id(), user_id=event.get_user_id(), role=event.get_role())

    @listen_to(OwnershipUpdatedEvent)
    def on_owner_updated(self, event: OwnershipUpdatedEvent, metadata: EventMetadata):
        self.repository.update_ownership(project_id=event.get_project_id(), user_id=event.get_owner_id())

    @listen_to(VisibilityUpdatedEvent)
    def on_visibility_updated(self, event: VisibilityUpdatedEvent, metadata: EventMetadata):
        self.repository.update_visibility(project_id=event.get_project_id(), visibility=event.get_visibility())


permissions_projector = PermissionsProjector(repository=permissions_projection)
