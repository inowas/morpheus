from flask import Blueprint
from flask_cors import cross_origin

from ..incoming import authenticate
from ..presentation.api.read.models.ReadModelObservationsRequestHandler import ReadModelHeadObservationsRequestHandler
from ..types.observations.HeadObservation import ObservationId
from ..types.Project import ProjectId


def register_routes(blueprint: Blueprint):
    """Register observation-related routes."""

    @blueprint.route('/<project_id>/model/head-observations', methods=['GET'])
    @blueprint.route('/<project_id>/model/head-observations/<head_observation_id>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_model_head_observations(project_id: str, head_observation_id: str | None = None):
        return ReadModelHeadObservationsRequestHandler().handle(project_id=ProjectId.from_str(project_id), head_observation_id=ObservationId.try_from_str(head_observation_id))
