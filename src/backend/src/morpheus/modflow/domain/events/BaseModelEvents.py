import dataclasses

from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.modflow.domain.events.ModflowEventName import ModflowEventName
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.types.Project import ProjectId
from morpheus.modflow.types.BaseModelVersion import BaseModelVersion, VersionId, VersionDescription


@dataclasses.dataclass(frozen=True)
class BaseModelCreatedEvent(EventBase):
    @classmethod
    def from_base_model(cls, project_id: ProjectId, base_model: ModflowModel):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload=base_model.to_dict(),
        )

    def get_base_model(self) -> ModflowModel:
        return ModflowModel.from_dict(obj=self.payload)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ModflowEventName.BASE_MODEL_CREATED.to_str())


class VersionCreatedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: BaseModelVersion):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload=version.to_dict(),
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ModflowEventName.VERSION_CREATED.to_str())

    def get_version(self) -> BaseModelVersion:
        return BaseModelVersion.from_dict(self.payload)


class VersionAssignedToBaseModelEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: BaseModelVersion):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload={'version_id': version.version_id.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload={'version_id': version_id.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ModflowEventName.VERSION_ASSIGNED_TO_BASEMODEL.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])


class VersionDeletedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: BaseModelVersion):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload={'version_id': version.version_id.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload={'version_id': version_id.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ModflowEventName.VERSION_DELETED.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])


class VersionDescriptionUpdatedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: BaseModelVersion):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload={'version_id': version.version_id.to_str(), 'description': version.description.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, description: VersionDescription):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            payload={'version_id': version_id.to_str(), 'description': description.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ModflowEventName.VERSION_DESCRIPTION_UPDATED.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])

    def get_description(self) -> VersionDescription:
        return VersionDescription.from_str(self.payload['description'])
