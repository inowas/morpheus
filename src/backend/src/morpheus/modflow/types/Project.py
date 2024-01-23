import dataclasses

from morpheus.common.types import Uuid
from .calculation.CalculationProfile import CalculationProfile, CalculationProfileCollection
from .ModflowModel import ModflowModel
from .Scenarios import ScenarioCollection
from .Settings import Settings
from .User import UserId


class ProjectId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class Project:
    project_id: ProjectId
    settings: Settings
    base_model: ModflowModel | None
    calculation_profile: CalculationProfile
    scenarios: ScenarioCollection

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId | None = None):
        return cls(
            project_id=project_id if project_id is not None else ProjectId.new(),
            base_model=None,
            calculation_profile=CalculationProfileCollection.new().get_selected_profile(),
            scenarios=ScenarioCollection.new(),
            settings=Settings.new(user_id=user_id)
        )

    def with_updated_base_model(self, base_model: ModflowModel):
        return dataclasses.replace(self, base_model=base_model)

    def with_updated_calculation_profile(self, calculation_profile: CalculationProfile):
        return dataclasses.replace(self, calculation_profile=calculation_profile)

    def with_updated_scenarios(self, scenarios: ScenarioCollection):
        return dataclasses.replace(self, scenarios=scenarios)

    def with_updated_settings(self, settings: Settings):
        return dataclasses.replace(self, settings=settings)
