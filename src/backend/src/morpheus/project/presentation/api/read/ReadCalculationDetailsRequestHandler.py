from morpheus.common.types.Exceptions import NotFoundException
from ....application.read.CalculationReader import get_calculation_reader
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId


class ReadCalculationDetailsRequestHandler:
    def handle(self, project_id: ProjectId, calculation_id: CalculationId):
        calculations_reader = get_calculation_reader()

        try:
            calculation = calculations_reader.get_calculation(project_id=project_id, calculation_id=calculation_id)
        except NotFoundException:
            return {'message': f'Calculation {calculation_id} for project {project_id} not found.'}, 404

        return calculation.to_dict(), 200
