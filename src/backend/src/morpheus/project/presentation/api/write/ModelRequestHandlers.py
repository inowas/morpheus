import dataclasses
from typing import TypedDict, Literal, Sequence, Optional
from flask import Request, abort, Response

from ....application.write.Model import UpdateModelGeometryCommand, UpdateModelGridCommand, UpdateModelTimeDiscretizationCommand
from ....application.write.Model.CreateModel import CreateModelCommandHandler, CreateModelCommand
from ....application.write.Model.UpdateModelGrid import UpdateModelGridCommandHandler
from ....application.write.Model.UpdateModelGeometry import UpdateModelGeometryCommandHandler
from ....application.write.Model.UpdateModelTimeDiscretization import UpdateModelTimeDiscretizationCommandHandler
from ....incoming import get_logged_in_user_id
from ....types.Model import ModelId
from ....types.discretization import TimeDiscretization
from ....types.discretization.spatial import Rotation

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

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        create_model_request = CreateModelRequest.from_dict(obj=request.json)
        geometry = Polygon.from_dict(dict(create_model_request.geometry))
        grid_properties = create_model_request.grid_properties
        rotation = Rotation.from_float(grid_properties['rotation'])

        command = CreateModelCommand(
            project_id=ProjectId.from_str(project_id),
            geometry=geometry,
            model_id=ModelId.new(),
            n_cols=grid_properties['n_cols'],
            n_rows=grid_properties['n_rows'],
            rotation=rotation,
            user_id=user_id,
        )

        CreateModelCommandHandler.handle(command=command)

        return Response(status=201, headers={'location': f'projects/{project_id}/model'})


@dataclasses.dataclass
class UpdateSpatialDiscretizationGeometryRequest:
    geometry: PolygonDict

    @classmethod
    def from_dict(cls, obj):
        return cls(
            geometry=obj['geometry'],
        )


class UpdateSpatialDiscretizationGeometryRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        project_id = ProjectId.from_str(project_id_parameter)
        update_spatial_discretization_geometry_request = UpdateSpatialDiscretizationGeometryRequest.from_dict(obj=request.json)
        geometry = Polygon.from_dict({
            'type': update_spatial_discretization_geometry_request.geometry['type'],
            'coordinates': update_spatial_discretization_geometry_request.geometry['coordinates']
        })

        command = UpdateModelGeometryCommand(
            project_id=project_id,
            geometry=geometry,
            user_id=user_id
        )

        UpdateModelGeometryCommandHandler.handle(command=command)
        return Response(status=204)


@dataclasses.dataclass
class UpdateSpatialDiscretizationGridRequest:
    n_cols: int
    n_rows: int
    origin: Optional[Point] = None  # optional
    col_widths: Optional[list[float]] = None  # optional
    total_width: Optional[float] = None  # optional
    row_heights: Optional[list[float]] = None  # optional
    total_height: Optional[float] = None  # optional
    rotation: Optional[float] = None  # optional
    length_unit: Optional[Literal["meters", "centimeters", "feet", "unknown"]] = None  # optional

    @classmethod
    def from_dict(cls, obj):
        return cls(
            n_cols=obj['n_cols'],
            n_rows=obj['n_rows'],
            origin=Point.from_dict(obj['origin']) if 'origin' in obj else None,
            col_widths=obj.get('col_widths') if 'col_widths' in obj else None,
            total_width=obj.get('total_width') if 'total_width' in obj else None,
            row_heights=obj.get('row_heights') if 'row_heights' in obj else None,
            total_height=obj.get('total_height') if 'total_height' in obj else None,
            rotation=obj.get('rotation') if 'rotation' in obj else None,
            length_unit=obj.get('length_unit') if 'length_unit' in obj else None
        )


class UpdateSpatialDiscretizationGridRequestHandler:
    @staticmethod
    def handle(request: Request, project_id_parameter: str):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

        project_id = ProjectId.from_str(project_id_parameter)
        update_spatial_discretization = UpdateSpatialDiscretizationGridRequest.from_dict(obj=request.json)
        command = UpdateModelGridCommand(
            project_id=project_id,
            n_cols=update_spatial_discretization.n_cols,
            n_rows=update_spatial_discretization.n_rows,
            origin=update_spatial_discretization.origin,
            col_widths=update_spatial_discretization.col_widths,
            total_width=update_spatial_discretization.total_width,
            row_heights=update_spatial_discretization.row_heights,
            total_height=update_spatial_discretization.total_height,
            rotation=update_spatial_discretization.rotation,
            length_unit=update_spatial_discretization.length_unit,
            user_id=user_id
        )

        UpdateModelGridCommandHandler.handle(command=command)
        return Response(status=204)


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

        user_id_str = get_logged_in_user_id()
        if user_id_str is None:
            abort(401, 'Unauthorized')
        user_id = UserId.from_str(user_id_str)

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
            user_id=user_id
        )

        UpdateModelTimeDiscretizationCommandHandler.handle(command=command)
        return None, 204
