from morpheus.common.types.Exceptions import NotFoundException
from ....application.read.CalculationsReader import get_calculations_reader
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId


class ReadCalculationDetailsRequestHandler:
    def handle(self, project_id: ProjectId, calculation_id: CalculationId):
        calculations_reader = get_calculations_reader()

        try:
            calculation = calculations_reader.get_calculation(project_id=project_id, calculation_id=calculation_id)
        except NotFoundException:
            return {'message': f'Calculation {calculation_id} for project {project_id} not found.'}, 404

        return {
            'calculation_id': calculation.calculation_id.to_str(),
            'model_id': calculation.model.model_id.to_str(),
            'calculation_profile_id': calculation.calculation_profile.id.to_str(),
            'calculation_lifecycle': calculation.calculation_lifecycle,
            'calculation_state': calculation.calculation_state,
            'calculation_log': calculation.calculation_log,
            'calculation_result': calculation.calculation_result,
        }, 200
