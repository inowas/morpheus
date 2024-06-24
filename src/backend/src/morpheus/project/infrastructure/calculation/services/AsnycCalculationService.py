from morpheus.common.types.Exceptions import NotFoundException
from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineBase import CalculationEngineBase
from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from morpheus.project.infrastructure.persistence.CalculationRepository import CalculationRepository, get_calculation_repository
from morpheus.project.types.Model import Model
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import Log, CalculationId, Calculation, CalculationState
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile
from morpheus.project.types.calculation.CalculationResult import CalculationResult


class AsyncCalculationService:
    repository: CalculationRepository
    engine: CalculationEngineBase | None
    calculation: Calculation | None

    def __init__(self, calculation_id: CalculationId):
        self.repository = get_calculation_repository()
        self.calculation = self.repository.get_calculation_by_id(calculation_id=calculation_id)
        profile = self.repository.get_profile_by_calculation_id(calculation_id=calculation_id)

        if profile is None:
            raise NotFoundException(f'Calculation profile not found for calculation {calculation_id.to_str()}')

        self.engine = CalculationEngineFactory().create_engine(engine_type=profile.engine_type, calculation_id=calculation_id)

    @staticmethod
    def create_async_calculation(project_id: ProjectId, model: Model, model_version: str, profile: CalculationProfile, calculation_id: CalculationId | None = None) -> CalculationId:
        calculation_id = calculation_id if calculation_id else CalculationId.new()
        repository = get_calculation_repository()
        repository.create_calculation(
            project_id=project_id,
            calculation_id=calculation_id,
            model=model,
            model_version=model_version,
            profile=profile
        )

        repository.update_calculation_state(calculation_id=calculation_id, state=CalculationState.CREATED)
        return calculation_id

    @staticmethod
    def calculate_by_worker(calculation_id: CalculationId):
        repository = get_calculation_repository()
        model = repository.get_model_by_calculation_id(calculation_id=calculation_id)
        profile = repository.get_profile_by_calculation_id(calculation_id=calculation_id)

        if model is None or profile is None:
            raise NotFoundException(f'Calculation with id {calculation_id.to_str()} not found')

        engine = CalculationEngineFactory().create_engine(engine_type=profile.engine_type, calculation_id=calculation_id)

        try:
            repository.update_calculation_state(calculation_id=calculation_id, state=CalculationState.PREPROCESSING)
            check_model_log = engine.preprocess(model=model, calculation_profile=profile)
            repository.update_calculation_check_model_log(calculation_id=calculation_id, check_model_log=check_model_log)

            repository.update_calculation_state(calculation_id=calculation_id, state=CalculationState.CALCULATING)
            calculation_log, calculation_result = engine.run(model=model, calculation_profile=profile)
            repository.update_calculation_result(calculation_id=calculation_id, result=calculation_result)
            repository.update_calculation_log(calculation_id=calculation_id, calculation_log=calculation_log)
            repository.update_calculation_state(calculation_id=calculation_id, state=CalculationState.COMPLETED)
        except Exception as e:
            calculation_log = Log.from_str(str(e))
            repository.update_calculation_log(calculation_id=calculation_id, calculation_log=calculation_log)
            repository.update_calculation_state(calculation_id=calculation_id, state=CalculationState.FAILED)

    @classmethod
    def load_calculation(cls, calculation_id: CalculationId):
        return cls(calculation_id=calculation_id)

    def get_result(self) -> CalculationResult | None:
        return self.calculation.result if self.calculation else None

    def get_calculation_log(self) -> Log | None:
        return self.calculation.calculation_log if self.calculation else None

    def get_check_model_log(self) -> Log | None:
        return self.calculation.check_model_log if self.calculation else None

    def read_flow_budget(self, idx: int, incremental: bool = False):
        if self.engine is None:
            raise ValueError('Engine not loaded')
        return self.engine.read_flow_budget(idx=idx, incremental=incremental)

    def read_flow_drawdown(self, idx: int, layer: int):
        if self.engine is None:
            raise ValueError('Engine not loaded')
        return self.engine.read_flow_drawdown(idx=idx, layer=layer)

    def read_flow_head(self, idx: int, layer: int):
        if self.engine is None:
            raise ValueError('Engine not loaded')
        return self.engine.read_flow_head(idx=idx, layer=layer)

    def read_transport_concentration(self, idx: int, layer: int):
        if self.engine is None:
            raise ValueError('Engine not loaded')
        return self.engine.read_transport_concentration(idx=idx, layer=layer)

    def read_transport_budget(self, idx: int, incremental: bool = False):
        if self.engine is None:
            raise ValueError('Engine not loaded')
        return self.engine.read_transport_budget(idx=idx, incremental=incremental)

    def read_head_observations(self):
        if self.engine is None:
            raise ValueError('Engine not loaded')
        return self.engine.read_head_observations()
