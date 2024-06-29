from morpheus.common.types.Exceptions import NotFoundException
from ....application.read.CalculationProfilesReader import get_calculation_profiles_reader
from ....application.read.CalculationReader import get_calculation_reader
from ....application.read.ModelReader import get_model_reader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....types.Project import ProjectId
from ....types.permissions.Privilege import Privilege


class ReadModelCalculationDetailsRequestHandler:
    def handle(self, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model_hash = get_model_reader().get_latest_model_hash(project_id=project_id)
            if model_hash is None:
                raise NotFoundException(f'No model found for project {project_id}.')

            calculation_profile = get_calculation_profiles_reader().get_selected_calculation_profile(project_id=project_id)
            calculation_profile_hash = calculation_profile.get_sha1_hash()
            calculation = get_calculation_reader().get_calculation_by_model_hash_and_profile_hash(project_id=project_id, model_hash=model_hash, profile_hash=calculation_profile_hash)

            return calculation.to_dict(), 200
        except NotFoundException:
            return {'message': f'No calculation found for latest model.'}, 404
