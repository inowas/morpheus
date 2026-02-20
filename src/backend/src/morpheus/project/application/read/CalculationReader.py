from morpheus.common.types.Exceptions import NotFoundException

from ...infrastructure.persistence.CalculationRepository import CalculationRepository, calculation_repository
from ...types.calculation.Calculation import Calculation, CalculationId
from ...types.calculation.CalculationProfile import CalculationProfile
from ...types.Model import Model, Sha1Hash
from ...types.Project import ProjectId


class CalculationReader:
    _repository: CalculationRepository

    def __init__(self, repository: CalculationRepository):
        self._repository = repository

    def get_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> Calculation:
        calculation = self._repository.get_calculation(project_id=project_id, calculation_id=calculation_id)
        if calculation is None:
            raise NotFoundException(f'Calculation {calculation_id} not found.')
        return calculation

    def get_model_by_calculation_id(self, project_id: ProjectId, calculation_id: CalculationId) -> Model:
        model = self._repository.get_model_by_calculation_id(calculation_id=calculation_id)
        if model is None:
            raise NotFoundException(f'Model for calculation {calculation_id} not found.')
        return model

    def get_profile_by_calculation_id(self, project_id: ProjectId, calculation_id: CalculationId) -> CalculationProfile:
        profile = self._repository.get_profile_by_calculation_id(calculation_id=calculation_id)
        if profile is None:
            raise NotFoundException(f'Profile for calculation {calculation_id} not found.')
        return profile

    def get_calculations(self, project_id: ProjectId) -> list[Calculation]:
        calculations = self._repository.get_calculations_by_project_id(project_id=project_id)
        if calculations is None:
            raise NotFoundException(f'Calculations for project {project_id} not found.')
        return calculations

    def get_calculation_by_model_hash_and_profile_hash(self, project_id: ProjectId, model_hash: Sha1Hash, profile_hash: Sha1Hash) -> Calculation:
        calculation = self._repository.get_calculation_by_project_id_model_hash_and_profile_hash(project_id=project_id, model_hash=model_hash, profile_hash=profile_hash)
        if calculation is None:
            raise NotFoundException(f'Calculation for project {project_id} with model hash {model_hash} and profile hash {profile_hash} not found.')
        return calculation


calculation_reader = CalculationReader(repository=calculation_repository)


def get_calculation_reader() -> CalculationReader:
    return calculation_reader
