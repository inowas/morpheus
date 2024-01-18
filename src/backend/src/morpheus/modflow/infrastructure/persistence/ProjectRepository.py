from morpheus.modflow.types.Settings import Metadata
from morpheus.modflow.types.Project import Project, ProjectId
from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, \
    create_or_get_collection
from morpheus.settings import settings as app_settings
from .BaseModelRepository import base_model_repository
from ...types.Settings import Settings


class ProjectRepository(RepositoryBase):
    def get_project_list(self) -> list[Project]:
        projects = self.collection.find({}, {'_id': 0, 'project_id': 1, 'permissions': 1, 'metadata': 1})
        return [Project.from_dict(project) for project in projects]

    def get_project(self, project_id: ProjectId) -> Project:
        project = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if project is None:
            raise Exception('Project does not exist')

        project = Project.from_dict(project)

        base_model = base_model_repository.get_base_model(project_id)
        if base_model is not None:
            project = project.with_updated_base_model(base_model)

        return project

    def save_project(self, project: Project):
        self.collection.insert_one(project.to_dict())

    def has_project(self, project_id: ProjectId) -> bool:
        return self.collection.find_one({'project_id': project_id.to_str()}) is not None

    def update_project(self, project: Project):
        if not self.has_project(project.project_id):
            raise Exception('Project does not exist')
        self.collection.replace_one({'project_id': project.project_id.to_str()}, project.to_dict())

    def get_project_settings(self, project_id: ProjectId) -> Settings:
        project = self.collection.find_one({'project_id': project_id.to_str()}, {'settings': 1})
        if project is None:
            raise Exception('Project does not exist')

        return Settings.from_dict(project['settings'])

    def update_project_settings(self, project_id: ProjectId, settings: Settings) -> None:
        if not self.has_project(project_id):
            raise Exception('Project does not exist')

        self.collection.update_one({'project_id': project_id.to_str()}, {'$set': {'settings': settings.to_dict()}})

    def get_project_metadata(self, project_id: ProjectId) -> Metadata:
        project_settings = self.get_project_settings(project_id)
        return project_settings.metadata


project_repository = ProjectRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'projects'
    )
)
