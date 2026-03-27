from typing import Literal

from flask import Blueprint, request
from flask_cors import cross_origin

from ..incoming import authenticate
from ..presentation.api.read.models.ReadModelAffectedCellsRequestHandler import ReadModelAffectedCellsRequestHandler
from ..presentation.api.read.models.ReadModelCalculationDetailsRequestHandler import ReadModelCalculationDetailsRequestHandler
from ..presentation.api.read.models.ReadModelGridRequestHandler import ReadModelGridRequestHandler
from ..presentation.api.read.models.ReadModelRequestHandler import ReadModelRequestHandler
from ..presentation.api.read.models.ReadModelSpatialDiscretizationRequestHandler import ReadModelSpatialDiscretizationRequestHandler
from ..presentation.api.read.models.ReadModelTimeDiscretizationRequestHandler import ReadModelTimeDiscretizationRequestHandler
from ..types.Project import ProjectId


def register_routes(blueprint: Blueprint):
    """Register model-related routes."""

    @blueprint.route('/<project_id>/model', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_get_model(project_id: str):
        return ReadModelRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/model/calculation', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_latest_model_calculation_details(project_id: str):
        return ReadModelCalculationDetailsRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/model/spatial-discretization', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_get_spatial_discretization(project_id: str):
        return ReadModelSpatialDiscretizationRequestHandler().handle(project_id=ProjectId.from_str(project_id))

    @blueprint.route('/<project_id>/model/spatial-discretization/affected-cells', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_spatial_discretization_get_affected_cells(project_id: str):
        output_format: Literal['json', 'geojson', 'geojson_outline'] | str = request.args.get('format', 'json')  # default to json
        return ReadModelAffectedCellsRequestHandler().handle(project_id=ProjectId.from_str(project_id), format=output_format)

    @blueprint.route('/<project_id>/model/spatial-discretization/grid', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_spatial_discretization_get_grid(project_id: str):
        output_format = request.args.get('format', 'json')
        if output_format not in ['json', 'geojson']:
            output_format = 'json'
        return ReadModelGridRequestHandler().handle(project_id=ProjectId.from_str(project_id), format=output_format)

    @blueprint.route('/<project_id>/model/time-discretization', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_time_discretization(project_id: str):
        return ReadModelTimeDiscretizationRequestHandler().handle(project_id=ProjectId.from_str(project_id))
