from morpheus.common.types.Exceptions import NotFoundException
from ....infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from ....infrastructure.persistence.CalculationRepository import get_calculation_repository
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId


class ReadCalculationFileRequestHandler:
    def handle(self, project_id: ProjectId, calculation_id: CalculationId, file_name: str):

        calculation = get_calculation_repository().get_calculation(project_id=project_id, calculation_id=calculation_id)
        if calculation is None:
            raise NotFoundException(f'Calculation {calculation_id.to_str()} not found in project {project_id.to_str()}')

        profile = calculation.profile

        engine = CalculationEngineFactory.create_engine(calculation_id=calculation_id, profile=profile)
        file_content = engine.read_file(file_name=file_name)

        if file_content is None:
            raise NotFoundException(f'File {file_name} not found in calculation {calculation_id} of project {project_id}')

        return {
            'file_name': file_name,
            'file_content': file_content
        }, 200
