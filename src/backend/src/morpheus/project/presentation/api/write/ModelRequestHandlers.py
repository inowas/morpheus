import dataclasses
from typing import TypedDict, Literal, Sequence, NotRequired
from flask import Request, abort, Response

from ....application.write.ModelCommandHandlers import CreateModelCommand, CreateModelCommandHandler, UpdateModelTimeDiscretizationCommand, UpdateTimeDiscretizationCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.Model import ModelId
from ....types.discretization import TimeDiscretization

from ....types.discretization.spatial.SpatialDiscretization import Polygon
from ....types.Project import ProjectId
from ....types.User import UserId
from ....types.discretization.time.Stressperiods import StartDateTime, EndDateTime, StressPeriodCollection
from ....types.discretization.time.TimeUnit import TimeUnit
from ....types.geometry import Point


class PolygonDict(TypedDict, total=True):
    type: str
    coordinates: list[list[list[float]]]


class CreateGridDict(TypedDict, total=True):
    n_cols: int
    n_rows: int
    rotation: float
    length_unit: Literal["meters", "centimeters", "feet", "unknown"]


@dataclasses.dataclass
class CreateModelRequest:
    geometry: PolygonDict
    grid_properties: CreateGridDict

    @classmethod
    def from_dict(cls, obj):
        return cls(
            geometry=obj['geometry'],
            grid_properties=obj['grid_properties']
        )


class CreateModelRequestHandler:
    @staticmethod
    def handle(request: Request, project_id: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        create_model_request = CreateModelRequest.from_dict(obj=request.json)
        geometry = Polygon.from_dict(dict(create_model_request.geometry))
        grid_properties = create_model_request.grid_properties

        command = CreateModelCommand(
            model_id=ModelId.new(),
            project_id=ProjectId.from_str(project_id),
            geometry=geometry,
            grid_properties=grid_properties,
            created_by=UserId.from_value(user_id)
        )

        CreateModelCommandHandler.handle(command=command)

        return Response(status=201, headers={'location': f'projects/{project_id}/model'})


class UpdateGridDict(TypedDict):
    n_cols: int
    n_rows: int
    origin: Point
    col_widths: NotRequired[list[float]]  # optional
    total_width: NotRequired[float]  # optional
    row_heights: NotRequired[list[float]]  # optional
    total_height: NotRequired[float]  # optional
    rotation: NotRequired[float]  # optional
    length_unit: NotRequired[Literal["meters", "centimeters", "feet", "unknown"]]  # optional


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
