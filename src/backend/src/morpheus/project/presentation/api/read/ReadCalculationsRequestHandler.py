from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from ....application.read.CalculationReader import get_calculation_reader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....types.Project import ProjectId
from ....types.permissions.Privilege import Privilege


class ReadCalculationsRequestHandler:
    def handle(self, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            calculations = get_calculation_reader().get_calculations(project_id=project_id)

            return [{
                'calculation_id': calculation.calculation_id.to_str(),
                'model_id': calculation.model_id.to_str(),
                'calculation_profile_id': calculation.profile_id.to_str(),
                'calculation_state': calculation.state,
                'calculation_log': calculation.calculation_log.to_list() if calculation.calculation_log is not None else None,
            } for calculation in calculations], 200
        except InsufficientPermissionsException as e:
            return str(e), 403
        except NotFoundException:
            return {'message': f'Calculations for project {project_id} not found.'}, 404
