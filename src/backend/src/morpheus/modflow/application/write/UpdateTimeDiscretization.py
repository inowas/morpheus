import dataclasses

from ...infrastructure.persistence.BaseModelRepository import BaseModelRepository
from morpheus.modflow.types.ModflowModel import ModelId
from morpheus.modflow.types.discretization.time.TimeDiscretization import TimeDiscretization, \
    StressPeriodCollection, TimeUnit, EndDateTime, StartDateTime

from ...types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class UpdateTimeDiscretizationCommand:
    project_id: ProjectId
    model_id: ModelId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    stress_periods: StressPeriodCollection
    time_unit: TimeUnit


@dataclasses.dataclass
class UpdateTimeDiscretizationCommandResult:
    pass


class UpdateTimeDiscretizationCommandHandler:
    @staticmethod
    def handle(command: UpdateTimeDiscretizationCommand):
        repository = BaseModelRepository()
        project_id = command.project_id
        model_id = command.model_id

        time_discretization = repository.get_base_model_time_discretization(project_id, model_id)
        if time_discretization is None:
            raise Exception(f'Could not find time discretization for model with id {model_id.to_str()}')

        start_date_time = time_discretization.start_datetime
        end_date_time = time_discretization.end_datetime
        stress_periods = time_discretization.stress_periods
        time_unit = time_discretization.time_unit

        time_discretization = TimeDiscretization(
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            stress_periods=stress_periods,
            time_unit=time_unit
        )

        repository.update_base_model_time_discretization(project_id, model_id, time_discretization)
        return UpdateTimeDiscretizationCommandResult()