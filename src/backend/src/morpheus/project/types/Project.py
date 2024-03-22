import dataclasses

from morpheus.common.types import Uuid, String
from .Permissions import Permissions, Visibility
from .calculation.CalculationProfile import CalculationProfile, CalculationProfileCollection
from .Model import Model
from .Scenarios import ScenarioCollection
from .User import UserId


class ProjectId(Uuid):
    pass


class Name(String):
    pass


class Description(String):
    pass


@dataclasses.dataclass
class Tags:
    value: list[str]

    @classmethod
    def from_list(cls, value: list[str]):
        return cls(value=value)

    @classmethod
    def from_value(cls, value: list[str]):
        return cls.from_list(value=value)

    def to_list(self):
        return self.value

    def to_value(self):
        return self.to_list()


@dataclasses.dataclass
class Metadata:
    name: Name
    description: Description
    tags: Tags

    @classmethod
    def new(cls):
        return cls(
            name=Name('New Model'),
            description=Description('New Model description'),
            tags=Tags([])
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            name=Name.from_value(obj['name']),
            description=Description.from_value(obj['description']),
            tags=Tags.from_value(obj['tags']),
        )

    def to_dict(self):
        return {
            'name': self.name.to_value(),
            'description': self.description.to_value(),
            'tags': self.tags.to_value(),
        }

    def with_updated_name(self, name: Name):
        return dataclasses.replace(self, name=name)

    def with_updated_description(self, description: Description):
        return dataclasses.replace(self, description=description)

    def with_updated_tags(self, tags: Tags):
        return dataclasses.replace(self, tags=tags)


@dataclasses.dataclass(frozen=True)
class Project:
    project_id: ProjectId
    metadata: Metadata
    permissions: Permissions
    model: Model | None
    calculation_profile: CalculationProfile
    scenarios: ScenarioCollection

    @classmethod
    def new(cls, user_id: UserId, project_id: ProjectId | None = None):
        return cls(
            project_id=project_id if project_id is not None else ProjectId.new(),
            metadata=Metadata.new(),
            permissions=Permissions.new(owner_id=user_id),
            model=None,
            calculation_profile=CalculationProfileCollection.new().get_selected_profile(),
            scenarios=ScenarioCollection.new(),
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=ProjectId.from_str(obj['project_id']),
            metadata=Metadata.from_dict(obj['metadata']),
            permissions=Permissions.from_dict(obj['permissions']),
            model=Model.from_dict(obj['model']) if obj['model'] is not None else None,
            calculation_profile=CalculationProfile.from_dict(obj['calculation_profile']),
            scenarios=ScenarioCollection.from_dict(obj['scenarios']),
        )

    def to_dict(self) -> dict:
        return {
            'project_id': self.project_id.to_str(),
            'metadata': self.metadata.to_dict(),
            'permissions': self.permissions.to_dict(),
            'model': self.model.to_dict() if self.model is not None else None,
            'calculation_profile': self.calculation_profile.to_dict(),
            'scenarios': self.scenarios.to_dict(),
        }

    def with_updated_metadata(self, metadata: Metadata):
        return dataclasses.replace(self, metadata=metadata)

    def with_updated_permissions(self, permissions: Permissions):
        return dataclasses.replace(self, permissions=permissions)

    def with_updated_model(self, model: Model):
        return dataclasses.replace(self, model=model)

    def with_updated_calculation_profile(self, calculation_profile: CalculationProfile):
        return dataclasses.replace(self, calculation_profile=calculation_profile)

    def with_updated_scenarios(self, scenarios: ScenarioCollection):
        return dataclasses.replace(self, scenarios=scenarios)


@dataclasses.dataclass(frozen=True)
class ProjectSummary:
    project_id: ProjectId
    project_name: Name
    project_description: Description
    project_tags: Tags
    owner_id: UserId
    visibility: Visibility

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            project_id=ProjectId.from_str(obj['project_id']),
            project_name=Name.from_str(obj['project_name']),
            project_description=Description.from_str(obj['project_description']),
            project_tags=Tags.from_list(obj['project_tags']),
            owner_id=UserId.from_str(obj['owner_id']),
            visibility=Visibility.from_str(obj['visibility']),
        )

    def to_dict(self) -> dict:
        return {
            'project_id': self.project_id.to_str(),
            'project_name': self.project_name.to_str(),
            'project_description': self.project_description.to_str(),
            'project_tags': self.project_tags.to_list(),
            'owner_id': self.owner_id.to_str(),
            'visibility': self.visibility.to_str(),
        }

    def with_name(self, name: Name) -> 'ProjectSummary':
        return dataclasses.replace(self, project_name=name)

    def with_description(self, description: Description) -> 'ProjectSummary':
        return dataclasses.replace(self, project_description=description)

    def with_tags(self, tags: Tags) -> 'ProjectSummary':
        return dataclasses.replace(self, project_tags=tags)

    def with_owner_id(self, owner_id: UserId) -> 'ProjectSummary':
        return dataclasses.replace(self, owner_id=owner_id)

    def with_visibility(self, visibility: Visibility) -> 'ProjectSummary':
        return dataclasses.replace(self, visibility=visibility)