import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope, OccurredAt
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from ...domain.events.PermissionEvents import MemberAddedEvent, MemberRemovedEvent, MemberRoleUpdatedEvent, VisibilityUpdatedEvent
from ...infrastructure.event_sourcing.ModflowEventBus import modflow_event_bus
from ..read.PermissionsReader import PermissionsReader
from ...types.Project import ProjectId
from ...types.Permissions import Role, Visibility
from ...types.User import UserId


@dataclasses.dataclass(frozen=True)
class AddMemberCommand:
    project_id: ProjectId
    new_member_id: UserId
    new_member_role: Role
    current_user_id: UserId


class AddMemberCommandHandler:
    @staticmethod
    def handle(command: AddMemberCommand):
        project_id = command.project_id
        new_member_id = command.new_member_id
        new_member_role = command.new_member_role
        current_user_id = command.current_user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(new_member_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to add a member to the project {project_id.to_str()}')

        if permissions.members.has_member(new_member_id):
            return

        event = MemberAddedEvent.from_user_id_and_role(project_id=project_id, user_id=new_member_id, role=new_member_role)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata, occurred_at=OccurredAt.now())
        modflow_event_bus.record(event_envelope=envelope)


@dataclasses.dataclass(frozen=True)
class UpdateMemberRoleCommand:
    project_id: ProjectId
    member_id: UserId
    role: Role
    current_user_id: UserId


class UpdateMemberRoleCommandHandler:
    @staticmethod
    def handle(command: UpdateMemberRoleCommand):
        project_id = command.project_id
        member_id = command.member_id
        role = command.role
        current_user_id = command.current_user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to update a member of the project {project_id.to_str()}')

        if not permissions.members.has_member(member_id):
            return

        event = MemberRoleUpdatedEvent.from_user_id_and_role(project_id=project_id, user_id=member_id, role=role)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata, occurred_at=OccurredAt.now())
        modflow_event_bus.record(event_envelope=envelope)


@dataclasses.dataclass(frozen=True)
class RemoveMemberCommand:
    project_id: ProjectId
    member_id: UserId
    current_user_id: UserId


class RemoveMemberCommandHandler:
    @staticmethod
    def handle(command: RemoveMemberCommand):
        project_id = command.project_id
        member_id = command.member_id
        current_user_id = command.current_user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to remove a member from the project {project_id.to_str()}')

        if not permissions.members.has_member(member_id):
            return

        event = MemberRemovedEvent.from_user_id(project_id=project_id, user_id=member_id)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata, occurred_at=OccurredAt.now())
        modflow_event_bus.record(event_envelope=envelope)


@dataclasses.dataclass(frozen=True)
class UpdateVisibilityCommand:
    project_id: ProjectId
    visibility: Visibility
    current_user_id: UserId


class UpdateVisibilityCommandHandler:
    @staticmethod
    def handle(command: UpdateVisibilityCommand):
        project_id = command.project_id
        current_user_id = command.current_user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)
        if not permissions.members.member_can_edit_members_and_permissions(current_user_id):
            raise InsufficientPermissionsException(f'User {current_user_id.to_str()} does not have permission to remove a member from the project {project_id.to_str()}')

        event = VisibilityUpdatedEvent.from_visibility(project_id=project_id, visibility=command.visibility)
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(current_user_id.to_str()))
        envelope = EventEnvelope(event=event, metadata=event_metadata, occurred_at=OccurredAt.now())
        modflow_event_bus.record(event_envelope=envelope)
