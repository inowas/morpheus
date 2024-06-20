from morpheus.common.types.Exceptions import NotFoundException
from ....infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from ....infrastructure.persistence.CalculationRepository import get_calculation_repository
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId


class ReadCalculationResultsRequestHandler:
    def handle(self, project_id: ProjectId, calculation_id: CalculationId, result_type: str, idx: int, layer: int = 0, incremental: bool = False):

        available_result_types = ['flow_head', 'flow_drawdown', 'flow_budget', 'transport_concentration', 'transport_budget']
        if result_type not in available_result_types:
            raise NotFoundException(f'Result type not found, available types are: {", ".join(available_result_types)}')

        calculation = get_calculation_repository().get_calculation(project_id=project_id, calculation_id=calculation_id)
        if calculation is None:
            raise NotFoundException(f'Calculation {calculation_id.to_str()} not found in project {project_id.to_str()}')

        engine = CalculationEngineFactory.create_engine(calculation_id=calculation_id, engine_type=calculation.get_engine_type())

        if result_type == 'flow_head':
            return engine.read_flow_head(idx=idx, layer=layer), 200

        if result_type == 'flow_drawdown':
            return engine.read_flow_drawdown(idx=idx, layer=layer), 200

        if result_type == 'flow_budget':
            return engine.read_flow_budget(idx=idx, incremental=incremental), 200

        if result_type == 'transport_concentration':
            return engine.read_transport_concentration(idx=idx, layer=layer), 200

        if result_type == 'transport_budget':
            return engine.read_transport_budget(idx=idx, incremental=incremental), 200

        raise NotFoundException(f'Result type not found, available types are: {", ".join(available_result_types)}')
