from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from ....application.read.CalculationReader import get_calculation_reader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId
from ....types.permissions.Privilege import Privilege


class ReadCalculationDetailsRequestHandler:
    def handle(self, project_id: ProjectId, calculation_id: CalculationId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            calculation = get_calculation_reader().get_calculation(project_id=project_id, calculation_id=calculation_id)
        except InsufficientPermissionsException as e:
            return str(e), 403
        except NotFoundException:
            return {'message': f'Calculation {calculation_id} for project {project_id} not found.'}, 404

        return calculation.to_dict(), 200
