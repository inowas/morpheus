from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.domain.events.ProjectEvents.ProjectEvents import ProjectCreatedEvent
from ...domain.events.ProjectPermissionEvents.PermissionEvents import MemberAddedEvent, MemberRemovedEvent, MemberRoleUpdatedEvent
from ...infrastructure.persistence.UserRoleAssignmentRepository import UserRoleAssignmentRepository, user_role_assignment_repository


class UserRoleAssignmentProjector(EventListenerBase):

    def __init__(self, repository: UserRoleAssignmentRepository):
        self.repository = repository

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata):
        for user_id, role in event.get_project().permissions.members.get_members().items():
            self.repository.add_role_for_member(project_id=event.get_project_id(), user_id=user_id, role=role)

    @listen_to(MemberAddedEvent)
    def on_member_added(self, event: MemberAddedEvent, metadata: EventMetadata):
        self.repository.add_role_for_member(project_id=event.get_project_id(), user_id=event.get_user_id(), role=event.get_role())

    @listen_to(MemberRemovedEvent)
    def on_member_removed(self, event: MemberRemovedEvent, metadata: EventMetadata):
        self.repository.remove_all_roles_for_member(project_id=event.get_project_id(), user_id=event.get_user_id())

    @listen_to(MemberRoleUpdatedEvent)
    def on_member_role_updated(self, event: MemberRoleUpdatedEvent, metadata: EventMetadata):
        self.repository.update_member_role(project_id=event.get_project_id(), user_id=event.get_user_id(), new_role=event.get_role())


user_role_assignment_projector = UserRoleAssignmentProjector(repository=user_role_assignment_repository)
