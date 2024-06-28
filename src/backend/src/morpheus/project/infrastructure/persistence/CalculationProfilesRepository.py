import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Model import Sha1Hash
from ...types.Project import ProjectId
from ...types.calculation.CalculationProfile import CalculationProfile, CalculationProfileId


@dataclasses.dataclass
class CalculationProfilesRepositoryDocument:
    project_id: str
    selected_calculation_profile_id: str | None
    calculation_profiles: dict[str, dict]

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            selected_calculation_profile_id=obj['selected_calculation_profile_id'],
            calculation_profiles=obj['calculation_profiles'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.project_id)

    def get_selected_profile_id(self) -> CalculationProfileId | None:
        return CalculationProfileId.from_str(self.selected_calculation_profile_id) if self.selected_calculation_profile_id is not None else None

    def get_selected_profile(self) -> CalculationProfile | None:
        if self.selected_calculation_profile_id not in self.calculation_profiles:
            return None

        return CalculationProfile.from_dict(self.calculation_profiles[self.selected_calculation_profile_id]) if self.selected_calculation_profile_id is not None else None

    def set_selected_profile_id(self, profile_id: CalculationProfileId) -> None:
        self.selected_calculation_profile_id = profile_id.to_str() if profile_id.to_str() in self.calculation_profiles else None

    def update_calculation_profile(self, calculation_profile: CalculationProfile) -> None:
        if calculation_profile.id.to_str() not in self.calculation_profiles:
            raise Exception(f'Calculation profile with id {calculation_profile.id.to_str()} does not exist')

        self.calculation_profiles[calculation_profile.id.to_str()] = calculation_profile.to_dict()

    def add_calculation_profile(self, calculation_profile: CalculationProfile) -> None:
        if calculation_profile.id.to_str() in self.calculation_profiles:
            raise Exception(f'Calculation profile with id {calculation_profile.id.to_str()} already exists')

        self.calculation_profiles[calculation_profile.id.to_str()] = calculation_profile.to_dict()

    def delete_calculation_profile(self, profile_id: CalculationProfileId) -> None:
        if profile_id.to_str() in self.calculation_profiles:
            del self.calculation_profiles[profile_id.to_str()]


class CalculationProfilesRepository(RepositoryBase):
    def has_calculation_profiles(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_document(self, project_id: ProjectId) -> CalculationProfilesRepositoryDocument:
        data = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if data is None:
            raise Exception(f'Calculation profiles do not exist for project {project_id.to_str()}')

        return CalculationProfilesRepositoryDocument.from_dict(dict(data))

    def get_calculation_profiles(self, project_id: ProjectId) -> list[CalculationProfile]:
        if not self.has_calculation_profiles(project_id):
            return []
        document = self.get_document(project_id)
        return [CalculationProfile.from_dict(profile) for profile in document.calculation_profiles.values()]

    def get_calculation_profile(self, project_id: ProjectId, calculation_profile_id: CalculationProfileId) -> CalculationProfile | None:
        if not self.has_calculation_profiles(project_id):
            return None
        document = self.get_document(project_id)
        if calculation_profile_id.to_str() not in document.calculation_profiles:
            return None
        return CalculationProfile.from_dict(document.calculation_profiles[calculation_profile_id.to_str()])

    def get_selected_calculation_profile(self, project_id: ProjectId) -> CalculationProfile | None:
        if not self.has_calculation_profiles(project_id):
            return None
        document = self.get_document(project_id)
        return document.get_selected_profile()

    def get_selected_calculation_profile_hash(self, project_id: ProjectId) -> Sha1Hash | None:
        if not self.has_calculation_profiles(project_id):
            return None
        document = self.get_document(project_id)
        return document.get_selected_profile().get_sha1_hash()

    def add_calculation_profile(self, project_id: ProjectId, calculation_profile: CalculationProfile) -> None:
        if not self.has_calculation_profiles(project_id):
            self.collection.insert_one({
                'project_id': project_id.to_str(),
                'selected_calculation_profile_id': calculation_profile.id.to_str(),
                'calculation_profiles': {
                    calculation_profile.id.to_str(): calculation_profile.to_dict()
                }
            })
            return

        document = self.get_document(project_id)
        document.add_calculation_profile(calculation_profile)

        self.collection.replace_one(
            filter={'project_id': project_id.to_str()},
            replacement=document.to_dict()
        )

    def update_calculation_profile(self, project_id: ProjectId, calculation_profile: CalculationProfile) -> None:
        document = self.get_document(project_id)
        document.update_calculation_profile(calculation_profile)

        self.collection.replace_one(
            filter={'project_id': project_id.to_str()},
            replacement=document.to_dict()
        )

    def update_selected_calculation_profile(self, project_id: ProjectId, calculation_profile_id: CalculationProfileId) -> None:
        document = self.get_document(project_id)
        document.set_selected_profile_id(calculation_profile_id)

        self.collection.replace_one(
            filter={'project_id': project_id.to_str()},
            replacement=document.to_dict()
        )

    def delete_calculation_profile(self, project_id: ProjectId, profile_id: CalculationProfileId) -> None:
        document = self.get_document(project_id)
        document.delete_calculation_profile(profile_id)

        self.collection.replace_one(
            filter={'project_id': project_id.to_str()},
            replacement=document.to_dict()
        )

    def delete_all(self, project_id: ProjectId) -> None:
        self.collection.delete_one({'project_id': project_id.to_str()})


calculation_profiles_repository = CalculationProfilesRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'calculation_profiles'
    )
)


def get_calculation_profiles_repository() -> CalculationProfilesRepository:
    return calculation_profiles_repository
