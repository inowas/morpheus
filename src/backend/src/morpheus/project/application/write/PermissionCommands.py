import dataclasses
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandName import CommandName
from morpheus.project.types.Permissions import Role, Visibility
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId


@dataclasses.dataclass(frozen=True)
class AddMemberCommand(CommandBase):
    command_name = CommandName.ADD_MEMBER
    new_member_id: UserId
    new_member_role: Role

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, new_member_id: UserId, new_member_role: Role):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            new_member_id=new_member_id,
            new_member_role=new_member_role,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            new_member_id=UserId.from_str(payload['new_member_id']),
            new_member_role=Role.from_str(payload['new_member_role']),
        )


@dataclasses.dataclass(frozen=True)
class UpdateMemberRoleCommand(CommandBase):
    command_name = CommandName.UPDATE_MEMBER_ROLE
    member_id: UserId
    new_role: Role

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, member_id: UserId, new_role: Role):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            member_id=member_id,
            new_role=new_role,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            member_id=UserId.from_str(payload['member_id']),
            new_role=Role.from_str(payload['new_role']),
        )


@dataclasses.dataclass(frozen=True)
class RemoveMemberCommand(CommandBase):
    command_name = CommandName.REMOVE_MEMBER
    member_id: UserId

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, member_id: UserId):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            member_id=member_id,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            member_id=UserId.from_str(payload['member_id']),
        )


@dataclasses.dataclass(frozen=True)
class UpdateVisibilityCommand(CommandBase):
    command_name = CommandName.UPDATE_VISIBILITY
    visibility: Visibility

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId, visibility: Visibility):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=project_id,
            visibility=visibility,
        )

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            command_name=cls.command_name,
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            visibility=Visibility.from_str(payload['visibility']),
        )
