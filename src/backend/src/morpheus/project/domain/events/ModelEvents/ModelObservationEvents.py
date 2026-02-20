from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import Point
from morpheus.project.types.layers import LayerId
from morpheus.project.types.Model import ModelId
from morpheus.project.types.observations.HeadObservation import HeadObservation, HeadObservationValue, ObservationId, ObservationName, ObservationTags, ObservationType
from morpheus.project.types.Project import ProjectId

from .EventNames import ModelObservationEventName


class ModelObservationAddedEvent(EventBase):
    @classmethod
    def from_observation(cls, project_id: ProjectId, model_id: ModelId, observation: HeadObservation, occurred_at: DateTime):
        return cls.create(entity_uuid=Uuid.from_str(project_id.to_str()), occurred_at=occurred_at, payload={'model_id': model_id.to_str(), 'observation': observation.to_dict()})

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
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'model_id': model_id.to_str(), 'observation_id': observation_id.to_str(), 'new_observation_id': new_observation_id.to_str()},
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
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation_id': observation_id.to_str(),
            },
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
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation_id': observation_id.to_str(),
            },
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
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()), occurred_at=occurred_at, payload={'model_id': model_id.to_str(), 'observation_id': observation_id.to_str()}
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
    def from_observation(
        cls,
        project_id: ProjectId,
        model_id: ModelId,
        observation_id: ObservationId,
        type: ObservationType,
        tags: ObservationTags,
        name: ObservationName,
        geometry: Point,
        affected_cells: ActiveCells,
        affected_layers: list[LayerId],
        data: list[HeadObservationValue],
        enabled: bool,
        occurred_at: DateTime,
    ):
        return cls.create(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'observation_id': observation_id.to_str(),
                'type': type.to_str(),
                'tags': tags.to_value(),
                'name': name.to_value(),
                'geometry': geometry.to_dict(),
                'affected_cells': affected_cells.to_dict(),
                'affected_layers': [layer_id.to_str() for layer_id in affected_layers],
                'data': [value.to_dict() for value in data],
                'enabled': enabled,
            },
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    def get_type(self) -> ObservationType:
        return ObservationType.from_str(self.payload['type'])

    def get_tags(self) -> ObservationTags:
        return ObservationTags.from_value(self.payload['tags'])

    def get_name(self) -> ObservationName:
        return ObservationName.from_value(self.payload['name'])

    def get_geometry(self) -> Point:
        return Point.from_dict(self.payload['geometry'])

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    def get_affected_layers(self) -> list[LayerId]:
        return [LayerId.from_str(layer_id) for layer_id in self.payload['affected_layers']]

    def get_data(self) -> list[HeadObservationValue]:
        return [HeadObservationValue.from_dict(value) for value in self.payload['data']]

    def get_enabled(self) -> bool:
        return self.payload['enabled']

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelObservationEventName.MODEL_HEAD_OBSERVATION_UPDATED.to_str())
