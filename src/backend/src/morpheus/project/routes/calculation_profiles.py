from flask import Blueprint
from flask_cors import cross_origin

from ..incoming import authenticate
from ..presentation.api.read.calculations.ReadCalculationProfilesRequestHandler import ReadCalculationProfilesRequestHandler
from ..presentation.api.read.projects.ReadProjectSelectedCalculationProfileRequestHandler import ReadProjectSelectedCalculationProfileRequestHandler
from ..types.calculation.CalculationProfile import CalculationProfileId
from ..types.Project import ProjectId


def register_routes(blueprint: Blueprint):
    """Register calculation profile-related routes."""

    @blueprint.route('/<project_id>/model/calculation-profile', methods=['GET'])
    @blueprint.route('/<project_id>/calculation-profiles/selected', methods=['GET'])
    @blueprint.route('/<project_id>/calculation-profiles/<calculation_profile_id>', methods=['GET'])
    @cross_origin()
    @authenticate()
    def project_selected_calculation_profile(project_id: str, calculation_profile_id: str | None = None):
        return ReadProjectSelectedCalculationProfileRequestHandler().handle(
            project_id=ProjectId.from_str(project_id), calculation_profile_id=CalculationProfileId.try_from_str(calculation_profile_id)
        )

    @blueprint.route('/<project_id>/calculation-profiles', methods=['GET'])
    @cross_origin()
    @authenticate()
    def get_project_calculation_profiles(project_id: str):
        return ReadCalculationProfilesRequestHandler().handle(project_id=ProjectId.from_str(project_id))
