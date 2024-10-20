from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.Model import Model
from morpheus.project.types.ModelVersion import ModelVersion, VersionId, VersionDescription
from morpheus.project.types.Project import ProjectId

from .EventNames import GeneralModelEventName


class ModelCreatedEvent(EventBase):
    @classmethod
    def from_model(cls, project_id: ProjectId, model: Model, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload=model.to_dict(),
        )

    def get_model(self) -> Model:
        return Model.from_dict(obj=self.payload)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GeneralModelEventName.MODEL_CREATED.to_str())


class VersionCreatedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload=version.to_dict(),
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GeneralModelEventName.VERSION_CREATED.to_str())

    def get_version(self) -> ModelVersion:
        return ModelVersion.from_dict(self.payload)


class VersionAssignedToModelEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GeneralModelEventName.VERSION_ASSIGNED_TO_MODEL.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])


class VersionDeletedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GeneralModelEventName.VERSION_DELETED.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])


class VersionDescriptionUpdatedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str(), 'description': version.description.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, description: VersionDescription, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str(), 'description': description.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(GeneralModelEventName.VERSION_DESCRIPTION_UPDATED.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])

    def get_description(self) -> VersionDescription:
        return VersionDescription.from_str(self.payload['description'])
