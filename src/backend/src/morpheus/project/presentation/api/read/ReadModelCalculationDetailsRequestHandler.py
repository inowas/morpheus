from morpheus.common.types.Exceptions import NotFoundException
from ....application.read.CalculationProfilesReader import get_calculation_profiles_reader
from ....application.read.CalculationReader import get_calculation_reader
from ....application.read.ModelReader import get_model_reader
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId


class ReadModelCalculationDetailsRequestHandler:
    def handle(self, project_id: ProjectId):
        model_reader = get_model_reader()

        model_hash = model_reader.get_latest_model_hash(project_id=project_id)
        if model_hash is None:
            return {'message': f'No model found for project {project_id}.'}, 404

        calculation_profile = get_calculation_profiles_reader().get_selected_calculation_profile(project_id=project_id)
        calculation_profile_hash = calculation_profile.get_sha1_hash()
        try:
            calculation = get_calculation_reader().get_calculation_by_model_hash_and_profile_hash(project_id=project_id, model_hash=model_hash, profile_hash=calculation_profile_hash)
        except NotFoundException:
            return {'message': f'No calculation found for latest model.'}, 404

        return calculation.to_dict(), 200
