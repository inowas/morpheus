from morpheus.modflow.types.Metadata import Metadata
from morpheus.modflow.types.Permissions import Permissions
from morpheus.modflow.types.Project import Project, ProjectId
from morpheus.common.infrastructure.persistence.mongodb import Database, get_database_client
from morpheus.settings import settings
from .BaseModelRepository import BaseModelRepository


class ProjectRepository:
    db: Database
    collection_name: str = 'projects'
    collection = None

    def __init__(self):
        self.db = get_database_client(settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True)
        self.collection = self.get_or_create_collection(self.collection_name)

    def create_collection(self, collection_name: str) -> None:
        self.db.create_collection(collection_name)

    def get_collection(self, collection_name: str):
        return self.db.get_collection(collection_name)

    def has_collection(self, collection_name: str) -> bool:
        return collection_name in self.list_collection_names()

    def list_collection_names(self) -> list[str]:
        return self.db.list_collection_names()

    def get_or_create_collection(self, collection_name: str):
        if not self.has_collection(collection_name):
            self.create_collection(collection_name)
        return self.get_collection(collection_name)

    def get_project_list(self) -> list[Project]:
        projects = self.collection.find({}, {'_id': 0, 'project_id': 1, 'permissions': 1, 'metadata': 1})
        return [Project.from_dict(project) for project in projects]

    def get_project(self, project_id: ProjectId) -> Project:
        project = self.collection.find_one({'project_id': project_id.to_str()}, {'_id': 0})
        if project is None:
            raise Exception('Project does not exist')

        project = Project.from_dict(project)

        base_model_repository = BaseModelRepository()
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

    def get_project_permissions(self, project_id: ProjectId) -> Permissions:
        if not self.has_project(project_id):
            raise Exception('Project does not exist')

        project = self.collection.find_one({'project_id': project_id.to_str()}, {'permissions': 1})
        return Permissions.from_dict(project['permissions'])

    def update_project_permissions(self, project_id: ProjectId, permissions: Permissions) -> None:
        if not self.has_project(project_id):
            raise Exception('Project does not exist')
        self.collection.update_one({'project_id': project_id.to_str()},
                                   {'$set': {'permissions': permissions.to_dict()}})

    def get_project_metadata(self, project_id: ProjectId) -> Metadata:
        if not self.has_project(project_id):
            raise Exception('Project does not exist')
        project = self.collection.find_one({'project_id': project_id.to_str()}, {'metadata': 1})
        return Metadata.from_dict(project['metadata'])

    def update_project_metadata(self, project_id: ProjectId, metadata: Metadata):
        if not self.has_project(project_id):
            raise Exception('Project does not exist')
        self.collection.update_one({'project_id': project_id.to_str()},
                                   {'$set': {'metadata': metadata.to_dict()}})
