from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Project import ProjectId
from ...types.Settings import Settings, Metadata


class SettingsRepository(RepositoryBase):
    def has_settings(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def get_projects_metadata(self) -> dict[ProjectId, Metadata]:
        items = self.collection.find({}, {'_id': 0, 'settings.metadata': 1, 'project_id': 1})
        result = {}
        for item in items:
            result[ProjectId.from_str(item['project_id'])] = Metadata.from_dict(item['settings']['metadata'])

        return result

    def get_metadata(self, project_id: ProjectId) -> Metadata:
        result = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0, 'settings.metadata': 1})
        if result is None or 'settings' not in result or 'metadata' not in result['settings']:
            raise Exception('Settings do not exist')

        return Metadata.from_dict(result['settings']['metadata'])

    def update_metadata(self, project_id: ProjectId, metadata: Metadata) -> None:
        if not self.has_settings(project_id):
            raise Exception('Settings do not exist')

        self.collection.replace_one({'project_id': project_id.to_str()}, {'settings.metadata': metadata.to_dict()})

    def get_settings(self, project_id: ProjectId) -> Settings:
        result = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0, 'settings': 1})
        if result is None or 'settings' not in result:
            raise Exception('Settings do not exist')

        return Settings.from_dict(result['settings'])

    def save_settings(self, project_id: ProjectId, settings: Settings) -> None:
        if self.has_settings(project_id):
            raise Exception('Settings already exist')

        self.collection.insert_one({
            'project_id': project_id.to_str(),
            'settings': settings.to_dict()
        })

    def update_settings(self, project_id: ProjectId, settings: Settings) -> None:
        if not self.has_settings(project_id):
            raise Exception('Settings do not exist')

        self.collection.replace_one({'project_id': project_id.to_str()}, {'settings': settings.to_dict()})

    def save_or_update_settings(self, project_id: ProjectId, settings: Settings) -> None:
        if self.has_settings(project_id):
            self.update_settings(project_id, settings)
        else:
            self.save_settings(project_id, settings)


settings_repository = SettingsRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'settings'
    )
)
