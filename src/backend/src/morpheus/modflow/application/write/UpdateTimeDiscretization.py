import dataclasses

from ...infrastructure.persistence.BaseModelRepository import base_model_repository
from morpheus.modflow.types.discretization.time.TimeDiscretization import TimeDiscretization, \
    StressPeriodCollection, TimeUnit, EndDateTime, StartDateTime
from ...infrastructure.persistence.ProjectRepository import ProjectRepository

from ...types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class UpdateTimeDiscretizationCommand:
    project_id: ProjectId
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    stress_periods: StressPeriodCollection
    time_unit: TimeUnit


class UpdateTimeDiscretizationCommandHandler:
    @staticmethod
    def handle(command: UpdateTimeDiscretizationCommand):
        project_id = command.project_id

        time_discretization = base_model_repository.get_base_model_time_discretization(project_id)
        if time_discretization is None:
            raise Exception(f'Could not find basemodel time discretization for project with id {project_id.to_str()}')

        start_date_time = time_discretization.start_date_time
        end_date_time = time_discretization.end_date_time
        stress_periods = time_discretization.stress_periods
        time_unit = time_discretization.time_unit

        time_discretization = TimeDiscretization(
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            stress_periods=stress_periods,
            time_unit=time_unit
        )

        project_repository = ProjectRepository()
        base_model = project_repository.get_base_model(project_id)
        if base_model is None:
            raise Exception(f'Could not find base model for project with id {project_id.to_str()}')

        base_model = base_model.with_updated_time_discretization(time_discretization)
        project_repository.update_base_model(project_id=project_id, base_model=base_model)
