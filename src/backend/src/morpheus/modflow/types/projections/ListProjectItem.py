import dataclasses

from morpheus.modflow.types.Project import ProjectId, Project
from morpheus.modflow.types.Settings import Name


@dataclasses.dataclass(frozen=True)
class ListProjectItem:
    project_id: ProjectId
    project_name: Name

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=ProjectId.from_str(obj['project_id']),
            project_name=Name.from_str(obj['project_name']),
        )

    def to_dict(self) -> dict:
        return {
            'project_id': self.project_id.to_str(),
            'project_name': self.project_name.to_str(),
        }
