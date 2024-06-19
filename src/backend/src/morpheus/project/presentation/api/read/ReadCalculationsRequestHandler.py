from morpheus.common.types.Exceptions import NotFoundException
from ....application.read.CalculationsReader import get_calculations_reader
from ....types.Project import ProjectId


class ReadCalculationsRequestHandler:
    def handle(self, project_id: ProjectId):
        calculations_reader = get_calculations_reader()

        try:
            calculations = calculations_reader.get_calculations(project_id=project_id)
        except NotFoundException:
            return {'message': f'Calculations for project {project_id} not found.'}, 404

        return [{
            'calculation_id': calculation.calculation_id.to_str(),
            'model_id': calculation.model.model_id.to_str(),
            'calculation_profile_id': calculation.calculation_profile.id.to_str(),
            'calculation_state': calculation.calculation_state,
            'calculation_log': calculation.calculation_log,
        } for calculation in calculations], 200
