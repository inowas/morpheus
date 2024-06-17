from ...infrastructure.persistence.CalculationProfilesRepository import get_calculation_profiles_repository, CalculationProfilesRepository
from ...types.Project import ProjectId
from ...types.calculation.CalculationProfile import CalculationProfile


class CalculationProfilesReader:
    _calculation_profiles_repository: CalculationProfilesRepository

    def __init__(self):
        self._calculation_profiles_repository = get_calculation_profiles_repository()

    def get_selected_calculation_profile(self, project_id: ProjectId) -> CalculationProfile | None:
        return self._calculation_profiles_repository.get_selected_calculation_profile(project_id=project_id)
