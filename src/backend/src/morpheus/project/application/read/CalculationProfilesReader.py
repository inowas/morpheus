from morpheus.common.types.Exceptions import NotFoundException
from ...infrastructure.persistence.CalculationProfilesRepository import CalculationProfilesRepository, calculation_profiles_repository
from ...types.Project import ProjectId
from ...types.calculation.CalculationProfile import CalculationProfile


class CalculationProfilesReader:
    _repository: CalculationProfilesRepository

    def __init__(self, repository: CalculationProfilesRepository):
        self._repository = repository

    def get_calculation_profiles(self, project_id: ProjectId) -> list[CalculationProfile]:
        return self._repository.get_calculation_profiles(project_id)

    def get_selected_calculation_profile(self, project_id: ProjectId) -> CalculationProfile:
        selected_calculation_profile = self._repository.get_selected_calculation_profile(project_id)
        if selected_calculation_profile is None:
            raise NotFoundException(f'Could not find selected calculation profile for project with id {project_id.to_str()}')
        return selected_calculation_profile


calculation_profiles_reader = CalculationProfilesReader(repository=calculation_profiles_repository)


def get_calculation_profiles_reader() -> CalculationProfilesReader:
    return calculation_profiles_reader
