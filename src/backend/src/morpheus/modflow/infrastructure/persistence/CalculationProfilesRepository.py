from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings

from ...types.Project import ProjectId
from ...types.calculation.CalculationProfile import CalculationProfileId, CalculationProfile, CalculationProfileCollection


class CalculationProfilesRepository(RepositoryBase):
    def has_profiles(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_profiles(self, project_id: ProjectId) -> CalculationProfileCollection:
        result = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0, 'profiles': 1})
        if result is None or 'profiles' not in result:
            raise Exception('Profiles do not exist')

        return CalculationProfileCollection.from_dict(result['profiles'])

    def get_profile(self, profile_id: CalculationProfileId) -> CalculationProfile:
        result = self.collection.find_one({'profile_id': profile_id.to_str()}, {'_id': 0})
        if result is None:
            raise Exception('Profile does not exist.')

        return CalculationProfile.from_dict(result)

    def get_selected_profile(self, project_id: ProjectId) -> CalculationProfile:
        profiles = self.get_profiles(project_id)
        return profiles.get_selected_profile()

    def save_profiles(self, project_id: ProjectId, profiles: CalculationProfileCollection) -> None:
        if self.has_profiles(project_id):
            raise Exception('Profiles already exist')

        self.collection.insert_one({
            'project_id': project_id.to_str(),
            'profiles': profiles.to_dict()
        })

    def update_profiles(self, project_id: ProjectId, profiles: CalculationProfileCollection) -> None:
        if not self.has_profiles(project_id):
            raise Exception('Profiles do not exist')

        self.collection.replace_one({'project_id': project_id.to_str()}, {'profiles': profiles.to_dict()})

    def save_or_update_profiles(self, project_id: ProjectId, profiles: CalculationProfileCollection) -> None:
        if self.has_profiles(project_id):
            self.update_profiles(project_id, profiles)
        else:
            self.save_profiles(project_id, profiles)

    def update_profile(self, project_id: ProjectId, profile: CalculationProfile) -> None:
        profiles = self.get_profiles(project_id)
        if profiles.has_profile(profile.profile_id):
            profiles = profiles.with_updated_profile(profile)

        if not profiles.has_profile(profile.profile_id):
            profiles = profiles.with_added_profile(profile)

        self.save_profiles(project_id, profiles)

    def save_or_update_selected_profile(self, project_id: ProjectId, profile: CalculationProfile) -> None:
        profiles = self.get_profiles(project_id)
        if profiles.has_profile(profile.profile_id):
            profiles = profiles.with_updated_profile(profile)

        if not profiles.has_profile(profile.profile_id):
            profiles = profiles.with_added_profile(profile)

        profiles = profiles.with_selected_profile(profile.profile_id)
        self.save_profiles(project_id, profiles)


calculation_profiles_repository = CalculationProfilesRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'calculation_profiles'
    )
)
