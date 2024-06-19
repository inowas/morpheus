from morpheus.common.types.Exceptions import NotFoundException
from ....application.read.CalculationProfilesReader import get_calculation_profiles_reader
from ....types.Project import ProjectId


class ReadCalculationProfilesRequestHandler:
    def handle(self, project_id: ProjectId):
        try:
            calculation_profiles = get_calculation_profiles_reader().get_calculation_profiles(project_id)
        except NotFoundException:
            return {'message': f'Calculation profiles not found for project with id {project_id.to_str()}'}, 404

        return [{'id': calculation_profile.id.to_str(),
                 'name': calculation_profile.name.to_str(),
                 'type': calculation_profile.engine_type,
                 } for calculation_profile in calculation_profiles
                ], 200
