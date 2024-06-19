from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineBase import CalculationEngineBase
from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, CalculationState, Calculation
from morpheus.project.infrastructure.persistence.CalculationsRepository import calculations_repository


class CalculationService:
    project_id: ProjectId | None
    calculation: Calculation
    engine: CalculationEngineBase

    def __init__(self, calculation: Calculation, project_id: ProjectId | None = None):
        self.project_id = project_id
        self.calculation = calculation
        self.engine = CalculationEngineFactory.create_engine(calculation)

        # persist calculation if it does not exist and a project_id is provided
        if project_id and not calculations_repository.has_calculation(project_id=project_id, calculation_id=calculation.calculation_id):
            calculations_repository.save_calculation(project_id=project_id, calculation=calculation)

    @classmethod
    def from_calculation(cls, calculation: Calculation, project_id: ProjectId | None = None):
        return cls(calculation=calculation, project_id=project_id)

    @classmethod
    def from_calculation_id(cls, project_id: ProjectId, calculation_id: CalculationId):
        calculation = calculations_repository.get_calculation(project_id=project_id, calculation_id=calculation_id)
        if calculation is None:
            raise Exception('Calculation does not exist')

        return cls(calculation=calculation)

    def calculate(self):
        if not self.calculation.calculation_state == CalculationState.CREATED:
            raise Exception('Calculation was already run or is still in progress')

        def on_change_calculation_state(new_state: CalculationState):
            self.calculation.set_new_state(new_state)
            if self.project_id:
                calculations_repository.update_calculation(project_id=self.project_id, calculation=self.calculation)

        self.engine.on_change_calulation_state(on_change_calculation_state)

        try:
            log, result = self.engine.run(
                model=self.calculation.model,
                calculation_profile=self.calculation.calculation_profile
            )

            self.calculation.set_new_state(CalculationState.COMPLETED)
            self.calculation.set_log(log)
            self.calculation.set_result(result)
            if self.project_id:
                calculations_repository.update_calculation(project_id=self.project_id, calculation=self.calculation)
        except Exception as e:
            self.calculation.append_to_log(str(e))
            self.calculation.set_new_state(CalculationState.FAILED)
            if self.project_id:
                calculations_repository.update_calculation(project_id=self.project_id, calculation=self.calculation)

    def get_result(self):
        return self.calculation.calculation_result

    def get_log(self):
        return self.calculation.calculation_log

    def get_calculation(self):
        return self.calculation

    def read_flow_budget(self, idx: int, incremental: bool = False):
        return self.engine.read_flow_budget(idx=idx, incremental=incremental)

    def read_flow_drawdown(self, idx: int, layer: int):
        return self.engine.read_flow_drawdown(idx=idx, layer=layer)

    def read_flow_head(self, idx: int, layer: int):
        return self.engine.read_flow_head(idx=idx, layer=layer)

    def read_transport_concentration(self, idx: int, layer: int):
        return self.engine.read_transport_concentration(idx=idx, layer=layer)

    def read_transport_budget(self, idx: int, layer: int):
        raise NotImplementedError()

    def read_head_observations(self):
        return self.engine.read_head_observations()
