import dataclasses
from typing import TypedDict

from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.infrastructure.persistence.CalculationRepository import get_calculation_repository
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId


class DeleteCalculationCommandPayload(TypedDict):
    project_id: str
    calculation_id: str


@dataclasses.dataclass(frozen=True)
class DeleteCalculationCommand(CommandBase):
    project_id: ProjectId
    calculation_id: CalculationId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            calculation_id=CalculationId.from_str(payload['calculation_id'])
        )


class DeleteCalculationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: DeleteCalculationCommand):
        project_id = command.project_id
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(
                f'User {user_id.to_str()} does not have permission to create a model of {project_id.to_str()}')

        calculation_repository = get_calculation_repository()
        assert calculation_repository.has_calculation(calculation_id=command.calculation_id, project_id=project_id)
        calculation_repository.delete_calculation_by_id(calculation_id=command.calculation_id)
