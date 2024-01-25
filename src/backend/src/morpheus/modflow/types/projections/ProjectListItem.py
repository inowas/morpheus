import dataclasses

from morpheus.modflow.types.Project import ProjectId, Name, Description, Tags
from morpheus.modflow.types.User import UserId


@dataclasses.dataclass(frozen=True)
class ProjectListItem:
    project_id: ProjectId
    project_name: Name
    project_description: Description
    project_tags: Tags
    owner_id: UserId

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=ProjectId.from_str(obj['project_id']),
            project_name=Name.from_str(obj['project_name']),
            project_description=Description.from_str(obj['project_description']),
            project_tags=Tags.from_list(obj['project_tags']),
            owner_id=UserId.from_str(obj['owner_id']),
        )

    def to_dict(self) -> dict:
        return {
            'project_id': self.project_id.to_str(),
            'project_name': self.project_name.to_str(),
            'project_description': self.project_description.to_str(),
            'project_tags': self.project_tags.to_list(),
            'owner_id': self.owner_id.to_str(),
        }
