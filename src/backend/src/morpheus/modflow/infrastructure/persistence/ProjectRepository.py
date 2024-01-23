from ...types.calculation.CalculationProfile import CalculationProfileCollection, CalculationProfile
from ...types.ModflowModel import ModflowModel
from ...types.Project import Project, ProjectId
from ...types.Scenarios import ScenarioCollection
from ...types.Settings import Settings, Metadata

from .BaseModelRepository import base_model_repository
from .CalculationProfilesRepository import calculation_profiles_repository
from .SettingsRepository import settings_repository
from .ScenariosRepository import scenarios_repository


class ProjectRepository:
    @staticmethod
    def get_project(self, project_id: ProjectId) -> Project:
        base_model = base_model_repository.get_base_model(project_id)

        selected_profile = calculation_profiles_repository.get_selected_profile(project_id)
        settings = settings_repository.get_settings(project_id)
        scenarios = scenarios_repository.get_scenarios(project_id)

        return Project(
            project_id=project_id,
            base_model=base_model,
            calculation_profile=selected_profile,
            settings=settings,
            scenarios=scenarios
        )

    def get_projects_metadata(self) -> dict[ProjectId, Metadata]:
        return settings_repository.get_projects_metadata()

    def save_project(self, project: Project) -> None:
        if isinstance(project.base_model, ModflowModel):
            base_model_repository.save_or_update_base_model(project_id=project.project_id, base_model=project.base_model)
        calculation_profiles_repository.save_or_update_selected_profile(project.project_id, project.calculation_profile)
        settings_repository.save_or_update_settings(project.project_id, project.settings)
        scenarios_repository.save_or_update_scenarios(project.project_id, project.scenarios)

    def get_base_model(self, project_id: ProjectId) -> ModflowModel | None:
        return base_model_repository.get_base_model(project_id)

    def update_base_model(self, project_id: ProjectId, base_model: ModflowModel) -> None:
        base_model_repository.update_base_model(project_id, base_model)

    def get_settings(self, project_id: ProjectId) -> Settings:
        return settings_repository.get_settings(project_id)

    def update_settings(self, project_id: ProjectId, settings: Settings) -> None:
        settings_repository.update_settings(project_id, settings)

    def get_metadata(self, project_id: ProjectId) -> Metadata:
        return settings_repository.get_metadata(project_id)

    def update_metadata(self, project_id: ProjectId, metadata: Metadata) -> None:
        settings_repository.update_metadata(project_id, metadata)

    def get_calculation_profiles(self, project_id: ProjectId) -> CalculationProfileCollection:
        return calculation_profiles_repository.get_profiles(project_id)

    def get_selected_calculation_profile(self, project_id: ProjectId) -> CalculationProfile:
        return calculation_profiles_repository.get_selected_profile(project_id)

    def update_selected_calculation_profile(self, project_id: ProjectId, calculation_profile: CalculationProfile) -> None:
        calculation_profiles_repository.save_or_update_selected_profile(project_id=project_id, profile=calculation_profile)

    def get_scenarios(self, project_id: ProjectId) -> ScenarioCollection:
        return scenarios_repository.get_scenarios(project_id)

    def update_scenarios(self, project_id: ProjectId, scenarios: ScenarioCollection) -> None:
        scenarios_repository.update_scenarios(project_id, scenarios)
