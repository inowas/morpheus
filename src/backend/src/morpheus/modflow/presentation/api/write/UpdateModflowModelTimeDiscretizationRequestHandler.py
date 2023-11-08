import dataclasses
from typing import TypedDict, Literal

from flask import Request, abort

from ....application.write.UpdateModflowModelTimeDiscretization import UpdateModflowModelTimeDiscretizationCommand, \
    UpdateModflowModelTimeDiscretizationCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.ModflowModel import ModelId
from ....types.TimeDiscretization import StartDateTime, StressPeriodCollection, TimeUnit


class StressPeriod(TypedDict, total=True):
    type: Literal['steady', 'transient']
    length: int
    number_of_time_steps: int
    time_step_multiplier: float


@dataclasses.dataclass
class UpdateModflowModelTimeDiscretizationRequest:
    start_datetime: str
    stress_periods: list[StressPeriod]
    time_unit: Literal['seconds', 'minutes', 'hours', 'days', 'years']

    @classmethod
    def from_dict(cls, obj):
        return cls(
            start_datetime=obj['start_datetime'],
            stress_periods=obj['stress_periods'],
            time_unit=obj['time_unit']
        )


class UpdateModflowModelTimeDiscretizationRequestHandler:
    @staticmethod
    def handle(request: Request, model_id: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        model_id = ModelId.from_str(model_id)
        update_time_discretization = UpdateModflowModelTimeDiscretizationRequest.from_dict(obj=request.json)

        start_datetime = StartDateTime.from_str(update_time_discretization.start_datetime)
        stress_periods = StressPeriodCollection.from_list(update_time_discretization.stress_periods)
        time_unit = TimeUnit.from_str(update_time_discretization.time_unit)

        command = UpdateModflowModelTimeDiscretizationCommand(
            model_id=model_id,
            start_datetime=start_datetime,
            stress_periods=stress_periods,
            time_unit=time_unit,
        )

        UpdateModflowModelTimeDiscretizationCommandHandler.handle(command=command)
        return None, 201
