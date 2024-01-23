import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.modflow.types.Project import ProjectSummary, ProjectId
from morpheus.modflow.types.Settings import Name, Description, Tags
from morpheus.modflow.types.User import UserId
from morpheus.settings import settings as app_settings


@dataclasses.dataclass
class ProjectSummaryDocument:
    project_id: str
    project_name: str
    project_description: str
    project_tags: list[str]
    owner_id: str

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            project_name=obj['project_name'],
            project_description=obj['project_description'],
            project_tags=obj['project_tags'],
            owner_id=obj['owner_id'],
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def to_summary(self) -> ProjectSummary:
        return ProjectSummary(
            project_id=ProjectId.from_str(self.project_id),
            project_name=Name.from_str(self.project_name),
            project_description=Description.from_str(self.project_description),
            project_tags=Tags.from_list(self.project_tags),
            owner_id=UserId.from_str(self.owner_id),
        )


class ProjectListRepository(RepositoryBase):
    def insert_or_update(self, summary: ProjectSummary) -> None:
        document = ProjectSummaryDocument(
            project_id=summary.project_id.to_str(),
            project_name=summary.project_name.to_str(),
            project_description=summary.project_description.to_str(),
            project_tags=summary.project_tags.to_list(),
            owner_id=summary.owner_id.to_str(),
        )

        if self.collection.find_one({'project_id': document.project_id}):
            self.collection.update_one(
                filter={'project_id': document.project_id},
                update={'$set': document.to_dict()},
            )
            return

        self.collection.insert_one(document.to_dict())

    def find_all(self) -> list[ProjectSummary]:
        documents = [ProjectSummaryDocument.from_dict(obj) for obj in self.collection.find()]
        return [ProjectSummary.from_dict(obj=document.to_dict()) for document in documents]


project_list_repository = ProjectListRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'project_list_projection'
    )
)
