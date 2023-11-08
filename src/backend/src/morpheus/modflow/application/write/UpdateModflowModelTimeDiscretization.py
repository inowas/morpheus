import dataclasses

from ...infrastructure.persistence.ModflowModelRepository import ModflowModelRepository
from ...types.ModflowModel import ModelId
from ...types.Metadata import Metadata, Description, Name, Tags
from ...types.TimeDiscretization import TimeDiscretization, StartDateTime, StressPeriodCollection, TimeUnit


@dataclasses.dataclass(frozen=True)
class UpdateModflowModelTimeDiscretizationCommand:
    model_id: ModelId
    start_datetime: StartDateTime
    stress_periods: StressPeriodCollection
    time_unit: TimeUnit


@dataclasses.dataclass
class UpdateModflowModelTimeDiscretizationCommandResult:
    pass


class UpdateModflowModelTimeDiscretizationCommandHandler:
    @staticmethod
    def handle(command: UpdateModflowModelTimeDiscretizationCommand):
        repository = ModflowModelRepository()
        model_id = command.model_id
        time_discretization = repository.get_modflow_model_time_discretization(model_id)
        if time_discretization is None:
            raise Exception(f'Could not find model with id {model_id.to_str()}')

        start_datetime = time_discretization.start_datetime
        stress_periods = time_discretization.stress_periods
        time_unit = time_discretization.time_unit

        time_discretization = TimeDiscretization(
            start_datetime=start_datetime,
            stress_periods=stress_periods,
            time_unit=time_unit
        )

        repository.update_modflow_model_time_discretization(model_id, time_discretization)

        return UpdateModflowModelTimeDiscretizationCommandResult()
