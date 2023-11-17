import dataclasses
from typing import TypedDict, Literal

from flask import Request, abort

from ....application.write.UpdateTimeDiscretization import UpdateTimeDiscretizationCommand, \
    UpdateTimeDiscretizationCommandHandler
from ....incoming import get_logged_in_user_id
from morpheus.modflow.types.ModflowModel import ModelId
from morpheus.modflow.types.discretization.TimeDiscretization import TimeUnit, EndDateTime, \
    StressPeriodCollection, StartDateTime
from ....types.Project import ProjectId


class StressPeriod(TypedDict, total=True):
    start_date_time: str
    type: Literal['steady', 'transient']
    number_of_time_steps: int
    time_step_multiplier: float


@dataclasses.dataclass
class UpdateTimeDiscretizationRequest:
    start_date_time: str
    end_datetime: str
    stress_periods: list[StressPeriod]
    time_unit: Literal['seconds', 'minutes', 'hours', 'days', 'years']

    @classmethod
    def from_dict(cls, obj):
        return cls(
            start_date_time=obj['start_date_time'],
            end_datetime=obj['end_datetime'],
            stress_periods=obj['stress_periods'],
            time_unit=obj['time_unit']
        )


class UpdateTimeDiscretizationRequestHandler:
    @staticmethod
    def handle(request: Request, project_id: str, model_id: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id)
        model_id = ModelId.from_str(model_id)

        update_time_discretization = UpdateTimeDiscretizationRequest.from_dict(obj=request.json)

        start_date_time = StartDateTime.from_str(update_time_discretization.start_date_time)
        end_date_time = EndDateTime.from_str(update_time_discretization.end_datetime)
        stress_periods = StressPeriodCollection.from_list(update_time_discretization.stress_periods)
        time_unit = TimeUnit.from_str(update_time_discretization.time_unit)

        command = UpdateTimeDiscretizationCommand(
            project_id=project_id,
            model_id=model_id,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            stress_periods=stress_periods,
            time_unit=time_unit,
        )

        UpdateTimeDiscretizationCommandHandler.handle(command=command)
        return None, 201
