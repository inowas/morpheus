import dataclasses
from typing import TypedDict

from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.infrastructure.persistence.CalculationRepository import get_calculation_repository
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, CalculationState


class StopCalculationCommandPayload(TypedDict):
    project_id: str
    calculation_id: str


@dataclasses.dataclass(frozen=True)
class StopCalculationCommand(ProjectCommandBase):
    calculation_id: CalculationId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            calculation_id=CalculationId.from_str(payload['calculation_id'])
        )


class StopCalculationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: StopCalculationCommand):
        calculation_repository = get_calculation_repository()
        calculation = calculation_repository.get_calculation_by_id(calculation_id=command.calculation_id)

        assert calculation is not None
        is_already_stopped = calculation.state in {CalculationState.CANCELED, CalculationState.COMPLETED, CalculationState.FAILED}

        if is_already_stopped:
            return

        calculation_repository.update_calculation_state(calculation_id=command.calculation_id, state=CalculationState.CANCELED)
