import dataclasses

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.project.domain.events.ProjectEventName import ProjectEventName
from morpheus.project.types.Asset import AssetId
from morpheus.project.types.Project import Project, ProjectId, Name, Description, Tags


@dataclasses.dataclass(frozen=True)
class ProjectCreatedEvent(EventBase):
    @classmethod
    def from_project(cls, project: Project, occurred_at=DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project.project_id.to_str()),
            occurred_at=occurred_at,
            payload=project.to_dict(),
        )

    def get_project(self) -> Project:
        return Project.from_dict(obj=self.payload)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.PROJECT_CREATED.to_str())


@dataclasses.dataclass(frozen=True)
class ProjectDeletedEvent(EventBase):
    @classmethod
    def from_project_id(cls, project_id: ProjectId, occurred_at=DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={}
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.PROJECT_DELETED.to_str())


@dataclasses.dataclass(frozen=True)
class ProjectMetadataUpdatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, name: Name | None = None, description: Description | None = None, tags: Tags | None = None, occurred_at=DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'name': name.to_str() if name else None,
                'description': description.to_str() if description else None,
                'tags': tags.to_list() if tags else None,
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_name(self) -> Name | None:
        return Name.from_str(self.payload['name']) if self.payload['name'] else None

    def get_description(self) -> Description | None:
        return Description.from_str(self.payload['description']) if self.payload['description'] else None

    def get_tags(self) -> Tags | None:
        return Tags.from_list(self.payload['tags']) if self.payload['tags'] else None

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.PROJECT_METADATA_UPDATED.to_str())


@dataclasses.dataclass(frozen=True)
class ProjectPreviewImageUpdatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, asset_id: AssetId, occurred_at=DateTime.now()):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'asset_id': asset_id.to_str(),
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_asset_id(self) -> AssetId:
        return AssetId.from_str(self.payload['asset_id'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.PROJECT_PREVIEW_IMAGE_UPDATED.to_str())
