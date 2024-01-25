from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, \
    create_or_get_collection
from morpheus.modflow.types.projections.ProjectListItem import ProjectListItem
from morpheus.settings import settings as app_settings


class ProjectListProjection(RepositoryBase):
    def insert_or_update(self, item: ProjectListItem) -> None:
        if self.collection.find_one({'project_id': item.project_id.to_str()}):
            self.collection.update_one(
                filter={'project_id': item.project_id.to_str()},
                update={'$set': item.to_dict()},
            )
            return

        self.collection.insert_one(item.to_dict())

    def find_all(self) -> list[ProjectListItem]:
        return [ProjectListItem.from_dict(obj) for obj in self.collection.find()]


project_list_projection = ProjectListProjection(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'project_list_projection'
    )
)
