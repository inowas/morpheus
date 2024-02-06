import dataclasses
from typing import TypedDict, Literal, Sequence
from flask import Request, abort, jsonify

from ....application.write.BaseModelCommandHandlers import CreateBaseModelCommand, CreateBaseModelCommandHandler, \
    CreateGridDict, UpdateModelTimeDiscretizationCommand, UpdateTimeDiscretizationCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.ModflowModel import ModelId
from ....types.discretization import TimeDiscretization

from ....types.discretization.spatial.SpatialDiscretization import Polygon
from ....types.Project import ProjectId
from ....types.User import UserId
from ....types.discretization.time.Stressperiods import StartDateTime, EndDateTime, StressPeriodCollection
from ....types.discretization.time.TimeUnit import TimeUnit


class PolygonDict(TypedDict, total=True):
    type: str
    coordinates: list[list[list[float]]]


@dataclasses.dataclass
class CreateBaseModelRequest:
    geometry: PolygonDict
    grid_properties: CreateGridDict

    @classmethod
    def from_dict(cls, obj):
        return cls(
            geometry=obj['geometry'],
            grid_properties=obj['grid_properties']
        )


class CreateBaseModelRequestHandler:
    @staticmethod
    def handle(request: Request, project_id: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        create_modflow_model_request = CreateBaseModelRequest.from_dict(obj=request.json)
        geometry = Polygon.from_dict(create_modflow_model_request.geometry.__dict__)
        grid_properties = create_modflow_model_request.grid_properties

        command = CreateBaseModelCommand(
            model_id=ModelId.new(),
            project_id=ProjectId.from_str(project_id),
            geometry=geometry,
            grid_properties=grid_properties,
            created_by=UserId.from_value(user_id)
        )

        CreateBaseModelCommandHandler.handle(command=command)
        response = jsonify()
        response.status_code = 201
        response.headers['location'] = f'projects/{command.project_id.to_str()}/base_model'

        return response


class StressPeriod(TypedDict, total=True):
    start_date_time: str
    type: Literal['steady', 'transient']
    number_of_time_steps: int
    time_step_multiplier: float


@dataclasses.dataclass
class UpdateTimeDiscretizationRequest:
    start_date_time: str
    end_datetime: str
    stress_periods: Sequence[StressPeriod]
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
    def handle(request: Request, project_id_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_parameter)

        update_time_discretization = UpdateTimeDiscretizationRequest.from_dict(obj=request.json)

        start_date_time = StartDateTime.from_str(update_time_discretization.start_date_time)
        end_date_time = EndDateTime.from_str(update_time_discretization.end_datetime)
        stress_periods = StressPeriodCollection.from_list(list(update_time_discretization.stress_periods))
        time_unit = TimeUnit.from_str(update_time_discretization.time_unit)

        time_discretization = TimeDiscretization(
            start_date_time=start_date_time,
            end_date_time=end_date_time,
            stress_periods=stress_periods,
            time_unit=time_unit,
        )

        command = UpdateModelTimeDiscretizationCommand(
            project_id=project_id,
            time_discretization=time_discretization,
            updated_by=UserId.from_value(user_id)
        )

        UpdateTimeDiscretizationCommandHandler.handle(command=command)
        return None, 204
