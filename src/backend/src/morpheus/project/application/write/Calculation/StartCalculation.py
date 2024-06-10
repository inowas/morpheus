import dataclasses
from typing import TypedDict, Optional

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.CalculationEvents import CalculationQueuedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.infrastructure.persistence.CalculationRepository import calculation_repository
from morpheus.project.tasks import run_calculation_by_id
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.calculation.Calculation import Calculation, CalculationId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfileId, CalculationProfile, CalculationEngineType


class StartCalculationCommandPayload(TypedDict):
    project_id: str
    model_id: str
    calculation_profile_id: Optional[str]


@dataclasses.dataclass(frozen=True)
class StartCalculationCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    calculation_profile_id: CalculationProfileId | None
    new_calculation_id: CalculationId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            calculation_profile_id=CalculationProfileId.from_str(
                payload['calculation_profile_id']) if 'calculation_profile_id' in payload else None,
            new_calculation_id=CalculationId.new()
        )


class StartCalculationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: StartCalculationCommand):
        project_id = command.project_id
        user_id = command.user_id

        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(
                f'User {user_id.to_str()} does not have permission to create a model of {project_id.to_str()}')

        if command.calculation_profile_id is not None:
            raise ValueError('Calculation profiles are not yet supported')

        calculation_profile = CalculationProfile.new(engine_type=CalculationEngineType.MF2005)
        model = ModelReader().get_latest_model(project_id=project_id)

        calculation = Calculation.new(model=model, calculation_profile=calculation_profile,
                                      calculation_id=command.new_calculation_id)
        calculation_repository.save_calculation(calculation)
        run_calculation_by_id.delay(calculation.calculation_id.to_str())  # type: ignore
        # see: https://github.com/microsoft/pylance-release/issues/4220#issuecomment-1501942176

        event = CalculationQueuedEvent.from_calculation_id(project_id=project_id,
                                                           calculation_id=calculation.calculation_id,
                                                           occurred_at=DateTime.now())
        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
