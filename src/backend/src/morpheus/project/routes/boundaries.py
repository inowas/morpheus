from typing import Literal

from flask import Blueprint, request
from flask_cors import cross_origin

from ..incoming import authenticate
from ..presentation.api.read.models.ReadModelBoundariesRequestHandler import ReadModelBoundariesRequestHandler
from ..presentation.api.read.models.ReadModelBoundaryAffectedCellsRequestHandler import ReadModelBoundaryAffectedCellsRequestHandler
from ..types.boundaries.Boundary import BoundaryId
from ..types.Project import ProjectId


def register_routes(blueprint: Blueprint):
    """Register boundary-related routes."""

    @blueprint.route('/<project_id>/model/boundaries', methods=['GET'])
    @blueprint.route('/<project_id>/model/boundaries/<boundary_id>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_boundaries(project_id: str, boundary_id: str | None = None):
        return ReadModelBoundariesRequestHandler().handle(project_id=ProjectId.from_str(project_id), boundary_id=BoundaryId.try_from_str(boundary_id))

    @blueprint.route('/<project_id>/model/boundaries/<boundary_id>/affected_cells', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_boundary_affected_cells(project_id: str, boundary_id: str):
        output_format: Literal['json', 'geojson', 'geojson_outline'] | str = request.args.get('format', 'json')  # default to json
        return ReadModelBoundaryAffectedCellsRequestHandler().handle(project_id=ProjectId.from_str(project_id), boundary_id=BoundaryId.from_str(boundary_id), format=output_format)
