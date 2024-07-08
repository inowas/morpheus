from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.observations.HeadObservation import HeadObservation, ObservationId

from .EventNames import ModelObservationEventName


class ModelObservationAddedEvent(EventBase):
    @classmethod
    def from_observation(cls, project_id: ProjectId, model_id: ModelId, observation: HeadObservation, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation': observation.to_dict()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_observation(self) -> HeadObservation:
        return HeadObservation.from_dict(self.payload['observation'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelObservationEventName.MODEL_HEAD_OBSERVATION_ADDED.to_str())


class ModelObservationClonedEvent(EventBase):
    @classmethod
    def from_observation_id(cls, project_id: ProjectId, model_id: ModelId, observation_id: ObservationId, new_observation_id: ObservationId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation_id': observation_id.to_str(),
                'new_observation_id': new_observation_id.to_str()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    def get_new_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['new_observation_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelObservationEventName.MODEL_HEAD_OBSERVATION_CLONED.to_str())


class ModelObservationEnabledEvent(EventBase):
    @classmethod
    def from_observation_id(cls, project_id: ProjectId, model_id: ModelId, observation_id: ObservationId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation_id': observation_id.to_str(),
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelObservationEventName.MODEL_HEAD_OBSERVATION_ENABLED.to_str())


class ModelObservationDisabledEvent(EventBase):
    @classmethod
    def from_observation_id(cls, project_id: ProjectId, model_id: ModelId, observation_id: ObservationId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation_id': observation_id.to_str(),
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelObservationEventName.MODEL_HEAD_OBSERVATION_DISABLED.to_str())


class ModelObservationRemovedEvent(EventBase):
    @classmethod
    def from_observation_id(cls, project_id: ProjectId, model_id: ModelId, observation_id: ObservationId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation_id': observation_id.to_str()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelObservationEventName.MODEL_HEAD_OBSERVATION_REMOVED.to_str())


class ModelObservationUpdatedEvent(EventBase):
    @classmethod
    def from_observation(cls, project_id: ProjectId, model_id: ModelId, observation_id: ObservationId, observation: HeadObservation, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation_id': observation_id.to_str(),
                'observation': observation.to_dict()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    def get_observation(self) -> HeadObservation:
        return HeadObservation.from_dict(self.payload['observation'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelObservationEventName.MODEL_HEAD_OBSERVATION_UPDATED.to_str())
