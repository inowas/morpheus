from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from ....application.read.CalculationProfilesReader import get_calculation_profiles_reader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....types.Project import ProjectId
from ....types.permissions.Privilege import Privilege


class ReadCalculationProfilesRequestHandler:
    def handle(self, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            calculation_profiles = get_calculation_profiles_reader().get_calculation_profiles(project_id)

            return [{'id': calculation_profile.id.to_str(),
                     'name': calculation_profile.name.to_str(),
                     'type': calculation_profile.engine_type,
                     } for calculation_profile in calculation_profiles
                    ], 200
        except InsufficientPermissionsException as e:
            return str(e), 403
        except NotFoundException:
            return {'message': f'Calculation profiles not found for project with id {project_id.to_str()}'}, 404
