from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from .PermissionCommands import AddMemberCommand, UpdateMemberRoleCommand, RemoveMemberCommand, UpdateVisibilityCommand
from ...domain.events.PermissionEvents import MemberAddedEvent, MemberRemovedEvent, MemberRoleUpdatedEvent, VisibilityUpdatedEvent
from ...infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from ..read.PermissionsReader import PermissionsReader


class AddMemberCommandHandler:
    @staticmethod
    def handle(command: AddMemberCommand):
        project_id = command.project_id
        new_member_id = command.new_member_id
        new_member_role = command.new_member_role
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(new_member_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to add a member to the project {project_id.to_str()}')

        if permissions.members.has_member(new_member_id):
            return

        event = MemberAddedEvent.from_user_id_and_role(project_id=project_id, user_id=new_member_id, role=new_member_role, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)


class UpdateMemberRoleCommandHandler:
    @staticmethod
    def handle(command: UpdateMemberRoleCommand):
        project_id = command.project_id
        member_id = command.member_id
        new_role = command.new_role
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update a member of the project {project_id.to_str()}')

        if not permissions.members.has_member(member_id):
            return

        event = MemberRoleUpdatedEvent.from_user_id_and_role(project_id=project_id, user_id=member_id, new_role=new_role, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)


class RemoveMemberCommandHandler:
    @staticmethod
    def handle(command: RemoveMemberCommand):
        project_id = command.project_id
        member_id = command.member_id
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to remove a member from the project {project_id.to_str()}')

        if not permissions.members.has_member(member_id):
            return

        event = MemberRemovedEvent.from_user_id(project_id=project_id, user_id=member_id, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)


class UpdateVisibilityCommandHandler:
    @staticmethod
    def handle(command: UpdateVisibilityCommand):
        project_id = command.project_id
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to remove a member from the project {project_id.to_str()}')

        event = VisibilityUpdatedEvent.from_visibility(project_id=project_id, visibility=command.visibility, occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=envelope)
