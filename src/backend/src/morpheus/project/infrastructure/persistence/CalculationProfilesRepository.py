import dataclasses
from typing import Sequence

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Project import ProjectId
from ...types.calculation.CalculationProfile import CalculationProfileMap, CalculationProfileTemplate, CalculationProfile


@dataclasses.dataclass(frozen=True)
class CalculationProfilesRepositoryDocument:
    project_id: str
    calculation_profiles: dict
    calculation_profile_templates: list[dict]

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            calculation_profiles=obj['calculation_profiles'],
            calculation_profile_templates=obj['calculation_profile_templates'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.project_id)

    def get_calculation_profile_map(self) -> CalculationProfileMap:
        return CalculationProfileMap.from_dict(self.calculation_profiles)

    def get_calculation_profile_templates(self) -> Sequence[CalculationProfileTemplate]:
        return [CalculationProfileTemplate.from_dict(template) for template in self.calculation_profile_templates]


class CalculationProfilesRepository(RepositoryBase):
    def has_calculation_profiles(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_or_create_calculation_profiles(self, project_id: ProjectId) -> CalculationProfileMap:
        if not self.has_calculation_profiles(project_id):
            self.collection.insert_one(CalculationProfilesRepositoryDocument(
                project_id=project_id.to_str(),
                calculation_profiles=CalculationProfileMap.default().to_dict(),
                calculation_profile_templates=[],
            ).to_dict())

        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            raise Exception(f'Calculation profiles do not exist for project {project_id.to_str()}')

        return CalculationProfilesRepositoryDocument.from_dict(dict(data)).get_calculation_profile_map()

    def get_selected_calculation_profile(self, project_id: ProjectId) -> CalculationProfile:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            raise Exception(f'Calculation profiles do not exist for project {project_id.to_str()}')

        return self.get_or_create_calculation_profiles(project_id).get_selected_profile()

    def get_calculation_profile_templates(self, project_id: ProjectId) -> Sequence[CalculationProfileTemplate]:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            raise Exception(f'Calculation profiles do not exist for project {project_id.to_str()}')

        return CalculationProfilesRepositoryDocument.from_dict(dict(data)).get_calculation_profile_templates()

    def update_calculation_profiles(self, project_id: ProjectId, calculation_profiles: CalculationProfileMap) -> None:
        if not self.has_calculation_profiles(project_id):
            raise Exception(f'Calculation profiles do not exist for project {project_id.to_str()}')

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'calculation_profiles': calculation_profiles.to_dict()}}
        )

    def update_calculation_profile_templates(self, project_id: ProjectId, calculation_profile_templates: Sequence[CalculationProfileTemplate]) -> None:
        if not self.has_calculation_profiles(project_id):
            raise Exception(f'Calculation profiles do not exist for project {project_id.to_str()}')

        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'calculation_profile_templates': [template.to_dict() for template in calculation_profile_templates]}}
        )


calculation_profiles_repository = CalculationProfilesRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'calculation_profiles'
    )
)


def get_calculation_profiles_repository() -> CalculationProfilesRepository:
    return calculation_profiles_repository
