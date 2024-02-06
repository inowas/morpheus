import dataclasses

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.settings import settings as app_settings
from ...types.Permissions import Visibility

from ...types.Project import ProjectSummary, ProjectId, Name, Description, Tags
from ...types.User import UserId


@dataclasses.dataclass
class ProjectSummaryRepositoryDocument:
    project_id: str
    project_name: str
    project_description: str
    project_tags: list[str]
    owner_id: str
    is_public: bool

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=obj['project_id'],
            project_name=obj['project_name'],
            project_description=obj['project_description'],
            project_tags=obj['project_tags'],
            owner_id=obj['owner_id'],
            is_public=obj['is_public'],
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
            visibility=Visibility.PUBLIC if self.is_public else Visibility.PRIVATE,
        )


class ProjectSummaryRepository(RepositoryBase):
    def insert_or_update(self, summary: ProjectSummary) -> None:
        document = ProjectSummaryRepositoryDocument(
            project_id=summary.project_id.to_str(),
            project_name=summary.project_name.to_str(),
            project_description=summary.project_description.to_str(),
            project_tags=summary.project_tags.to_list(),
            owner_id=summary.owner_id.to_str(),
            is_public=summary.visibility == Visibility.PUBLIC,
        )

        if self.collection.find_one({'project_id': document.project_id}):
            self.collection.update_one(
                filter={'project_id': document.project_id},
                update={'$set': document.to_dict()},
            )
            return

        self.collection.insert_one(document.to_dict())

    def update_owner_id(self, project_id: ProjectId, owner_id: UserId) -> None:
        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'owner_id': owner_id.to_str()}},
        )

    def update_visibility(self, project_id: ProjectId, visibility: Visibility) -> None:
        self.collection.update_one(
            filter={'project_id': project_id.to_str()},
            update={'$set': {'is_public': visibility == Visibility.PUBLIC}},
        )

    def find_all(self) -> list[ProjectSummary]:
        documents = [ProjectSummaryRepositoryDocument.from_dict(obj) for obj in self.collection.find()]
        return [document.to_summary() for document in documents]

    def get_summary(self, project_id: ProjectId) -> ProjectSummary | None:
        document = self.collection.find_one({'project_id': project_id.to_str()})
        if document is None:
            return None

        return ProjectSummaryRepositoryDocument.from_dict(obj=dict(document)).to_summary()


project_summary_repository: ProjectSummaryRepository = ProjectSummaryRepository(
    collection=create_or_get_collection(
        get_database_client(app_settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'project_summaries_projection'
    )
)
