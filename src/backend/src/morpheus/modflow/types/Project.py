import dataclasses

from morpheus.common.types import Uuid
from .ModflowModel import ModflowModel
from .Scenarios import Scenario
from .Metadata import Metadata
from .Permissions import Permissions
from .User import UserId


class ProjectId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class Project:
    project_id: ProjectId
    permissions: Permissions
    metadata: Metadata
    base_model: ModflowModel | None
    scenarios: list[Scenario]

    @classmethod
    def new(cls, user_id: UserId):
        return cls(
            project_id=ProjectId.new(),
            permissions=Permissions.new(creator_id=user_id),
            metadata=Metadata.new(),
            base_model=None,
            scenarios=[]
        )

    def with_updated_permissions(self, permissions: Permissions):
        return dataclasses.replace(self, permissions=permissions)

    def with_updated_metadata(self, metadata: Metadata):
        return dataclasses.replace(self, metadata=metadata)

    def with_updated_base_model(self, base_model: ModflowModel):
        return dataclasses.replace(self, base_model=base_model)

    def with_updated_scenarios(self, scenarios: list[Scenario]):
        return dataclasses.replace(self, scenarios=scenarios)

    @classmethod
    def from_dict(cls, obj):
        return cls(
            project_id=ProjectId.from_value(obj['project_id']),
            permissions=Permissions.from_dict(obj['permissions']),
            metadata=Metadata.from_dict(obj['metadata']),
            base_model=ModflowModel.from_dict(obj['base_model']) if 'base_model' in obj else None,
            scenarios=obj['scenarios'] if 'scenarios' in obj else []
        )

    def to_dict(self):
        return {
            'project_id': self.project_id.to_value(),
            'permissions': self.permissions.to_dict(),
            'metadata': self.metadata.to_dict(),
            'base_model': self.base_model.to_dict() if self.base_model is not None else None,
            'scenarios': [scenario.to_dict() for scenario in self.scenarios]
        }