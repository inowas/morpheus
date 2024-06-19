from morpheus.common.types.Exceptions import NotFoundException
from ....infrastructure.calculation.services.CalculationService import CalculationService
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId


class ReadCalculationFileRequestHandler:
    def handle(self, project_id: ProjectId, calculation_id: CalculationId, file_name: str):
        calculation_service = CalculationService.from_calculation_id(project_id=project_id, calculation_id=calculation_id)
        file_content = calculation_service.read_file(file_name=file_name)

        if file_content is None:
            raise NotFoundException(f'File {file_name} not found in calculation {calculation_id} of project {project_id}')

        return {
            'file_name': file_name,
            'file_content': file_content
        }, 200
