import dataclasses
from typing import TypedDict

from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.CalculationProfilesReader import get_calculation_profiles_reader
from morpheus.project.application.read.ModelReader import get_model_reader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.infrastructure.calculation.services.AsnycCalculationService import AsyncCalculationService
from morpheus.project.tasks import run_calculation_by_id
from morpheus.project.types.calculation.Calculation import CalculationId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId


class StartCalculationCommandPayload(TypedDict):
    project_id: str
    model_id: str


@dataclasses.dataclass(frozen=True)
class StartCalculationCommand(ProjectCommandBase):
    model_id: ModelId
    new_calculation_id: CalculationId

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        return cls(user_id=user_id, project_id=ProjectId.from_str(payload['project_id']), model_id=ModelId.from_str(payload['model_id']), new_calculation_id=CalculationId.new())


class StartCalculationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: StartCalculationCommand):
        project_id = command.project_id

        calculation_profile = get_calculation_profiles_reader().get_selected_calculation_profile(project_id=project_id)
        if not isinstance(calculation_profile, CalculationProfile):
            raise ValueError('Calculation profile not found')

        model_reader = get_model_reader()
        model = model_reader.get_latest_model(project_id=project_id)
        version = model_reader.get_latest_model_version_string(project_id=project_id)

        calculation_id = AsyncCalculationService.create_async_calculation(
            project_id=project_id, model=model, model_version=version, profile=calculation_profile, calculation_id=command.new_calculation_id
        )
        run_calculation_by_id.delay(calculation_id=calculation_id.to_str())  # type: ignore
        # see: https://github.com/microsoft/pylance-release/issues/4220#issuecomment-1501942176
