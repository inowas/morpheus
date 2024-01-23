import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, \
    create_or_get_collection
from morpheus.modflow.types.Project import ProjectId
from morpheus.modflow.types.Settings import Name
from morpheus.modflow.types.projections.ListProjectItem import ListProjectItem
from morpheus.settings import settings as app_settings


@dataclasses.dataclass
class ProjectProjectionDocument:
    project_id: str
    project_name: str

    @classmethod
    def from_item(cls, item: ListProjectItem):
        return cls(
            project_id=item.project_id.to_str(),
            project_name=item.project_name.to_str(),
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            project_name=obj['project_name'],
        )

    def to_item(self) -> ListProjectItem:
        return ListProjectItem(
            project_id=ProjectId.from_str(self.project_id),
            project_name=Name.from_str(self.project_name),
        )

    def to_dict(self) -> dict:
        return {
            'project_id': self.project_id,
            'project_name': self.project_name,
        }


class ProjectListProjectionRepository(RepositoryBase):
    def insert(self, project_projection_item: ListProjectItem):
        self.collection.insert_one(ProjectProjectionDocument.from_item(project_projection_item).to_dict())

    def find_all(self) -> list[ListProjectItem]:
        return [ProjectProjectionDocument.from_dict(document).to_item() for document in self.collection.find({}, {'_id': 0})]


project_list_projection_repository = ProjectListProjectionRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'project_list_projection'
    )
)
