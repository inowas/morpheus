import dataclasses

from morpheus.project.application.write.CommandName import CommandName
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId


@dataclasses.dataclass(frozen=True)
class CommandBase:
    command_name: CommandName
    user_id: UserId
    project_id: ProjectId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        raise NotImplementedError
