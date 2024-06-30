from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from ....application.read.CalculationProfilesReader import get_calculation_profiles_reader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....types.Project import ProjectId
from ....types.calculation.CalculationProfile import CalculationProfileId
from ....types.permissions.Privilege import Privilege


class ReadSelectedCalculationProfileRequestHandler:
    def handle(self, project_id: ProjectId, calculation_profile_id: CalculationProfileId | None = None):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
        except InsufficientPermissionsException as e:
            return str(e), 403

        if not calculation_profile_id:
            try:
                return get_calculation_profiles_reader().get_selected_calculation_profile(project_id=project_id).to_dict(), 200
            except NotFoundException:
                return {'message': f'Selected calculation profile not found for project with id {project_id.to_str()}'}, 404

        try:
            return get_calculation_profiles_reader().get_calculation_profile(project_id=project_id, calculation_profile_id=calculation_profile_id).to_dict(), 200
        except NotFoundException:
            return {'message': f'Calculation profile not found for project with id {project_id.to_str()} and calculation profile id {calculation_profile_id.to_str()}'}, 404
