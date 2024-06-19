from morpheus.common.types.Exceptions import NotFoundException
from ....application.read.CalculationProfilesReader import get_calculation_profiles_reader
from ....types.Project import ProjectId


class ReadSelectedCalculationProfileRequestHandler:
    def handle(self, project_id: ProjectId):
        try:
            selected_calculation_profile = get_calculation_profiles_reader().get_selected_calculation_profile(project_id)
        except NotFoundException:
            return {'message': f'Selected calculation profile not found for project with id {project_id.to_str()}'}, 404

        return selected_calculation_profile.to_dict(), 200
