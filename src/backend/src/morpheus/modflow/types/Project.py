import dataclasses

from morpheus.common.types import Uuid
from .calculation.CalculationProfile import CalculationProfileId
from .ModflowModel import ModflowModel
from .Scenarios import Scenario
from .Settings import Settings
from .User import UserId


class ProjectId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class Project:
    project_id: ProjectId
    base_model: ModflowModel | None
    calculation_profile_id: CalculationProfileId | None
    scenarios: list[Scenario]
    settings: Settings

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId | None = None):
        return cls(
            project_id=project_id if project_id is not None else ProjectId.new(),
            base_model=None,
            calculation_profile_id=None,
            scenarios=[],
            settings=Settings.new(user_id=user_id)
        )

    def with_updated_base_model(self, base_model: ModflowModel):
        return dataclasses.replace(self, base_model=base_model)

    def with_updated_calculation_profile_id(self, calculation_profile_id: CalculationProfileId):
        return dataclasses.replace(self, calculation_profile_id=calculation_profile_id)

    def with_updated_scenarios(self, scenarios: list[Scenario]):
        return dataclasses.replace(self, scenarios=scenarios)

    def with_updated_settings(self, settings: Settings):
        return dataclasses.replace(self, settings=settings)

    @classmethod
    def from_dict(cls, obj):
        return cls(
            project_id=ProjectId.from_value(obj['project_id']),
            base_model=ModflowModel.from_dict(obj['base_model']) if 'base_model' in obj else None,
            calculation_profile_id=CalculationProfileId.from_value(
                obj['calculation_profile_id']) if 'calculation_profile_id' in obj else None,
            scenarios=obj['scenarios'] if 'scenarios' in obj else [],
            settings=Settings.from_dict(obj['settings'])
        )

    def to_dict(self):
        return {
            'project_id': self.project_id.to_value(),
            'base_model': self.base_model.to_dict() if self.base_model is not None else None,
            'calculation_profile_id': self.calculation_profile_id.to_value() if self.calculation_profile_id is not None else None,
            'scenarios': [scenario.to_dict() for scenario in self.scenarios],
            'settings': self.settings.to_dict()
        }
