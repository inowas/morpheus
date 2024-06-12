from typing import Sequence

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.boundaries.Boundary import Boundary, BoundaryId, BoundaryName, BoundaryTags, BoundaryType
from morpheus.project.types.boundaries.Observation import Observation, ObservationId
from morpheus.project.types.boundaries.ObservationFactory import ObservationFactory
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import Polygon, LineString, Point, GeometryFactory
from morpheus.project.types.layers import LayerId

from .EventNames import ModelBoundaryEventName


class ModelBoundaryAddedEvent(EventBase):
    @classmethod
    def from_boundary(cls, project_id: ProjectId, model_id: ModelId, boundary: Boundary, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary': boundary.to_dict()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary(self) -> Boundary:
        return Boundary.from_dict(self.payload['boundary'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_ADDED.to_str())


class ModelBoundaryClonedEvent(EventBase):
    @classmethod
    def from_boundary_id(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, new_boundary_id: BoundaryId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'new_boundary_id': new_boundary_id.to_str()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_new_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['new_boundary_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_CLONED.to_str())


class ModelBoundaryAffectedCellsUpdatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, affected_cells: ActiveCells, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'affected_cells': affected_cells.to_dict(),
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_AFFECTED_CELLS_UPDATED.to_str())


class ModelBoundaryAffectedCellsRecalculatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, affected_cells: ActiveCells, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'affected_cells': affected_cells.to_dict(),
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_AFFECTED_CELLS_RECALCULATED.to_str())


class ModelBoundaryAffectedLayersUpdatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, affected_layers: Sequence[LayerId], occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'affected_layers': [layer_id.to_str() for layer_id in affected_layers]
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_affected_layers(self) -> Sequence[LayerId]:
        return [LayerId.from_str(layer_id) for layer_id in self.payload['affected_layers']]

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_AFFECTED_LAYERS_UPDATED.to_str())


class ModelBoundaryDisabledEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_DISABLED.to_str())


class ModelBoundaryEnabledEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_ENABLED.to_str())


class ModelBoundaryGeometryUpdatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, geometry: Point | LineString | Polygon, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'geometry': geometry.to_dict()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_geometry(self) -> Point | LineString | Polygon:
        return GeometryFactory.from_dict(self.payload['geometry'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_GEOMETRY_UPDATED.to_str())


class ModelBoundaryMetadataUpdatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, name: BoundaryName | None, tags: BoundaryTags | None,
                   occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'name': name.to_str() if name else None,
                'tags': tags.to_list() if tags else None
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_name(self) -> BoundaryName | None:
        return BoundaryName.from_str(self.payload['name']) if self.payload['name'] else None

    def get_tags(self) -> BoundaryTags | None:
        return BoundaryTags.from_list(self.payload['tags']) if isinstance(self.payload['tags'], list) else None

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_METADATA_UPDATED.to_str())


class ModelBoundaryRemovedEvent(EventBase):
    @classmethod
    def from_boundary_id(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_REMOVED.to_str())


class ModelBoundaryObservationAddedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, observation: Observation, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'observation': observation.to_dict()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_observation(self) -> Observation:
        return Observation.from_dict(self.payload['observation'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_OBSERVATION_ADDED.to_str())


class ModelBoundaryObservationRemovedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, observation_id: Uuid, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'observation_id': observation_id.to_str()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_OBSERVATION_REMOVED.to_str())


class ModelBoundaryObservationUpdatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId, boundary_type: BoundaryType,
                   observation_id: ObservationId, observation: Observation, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'boundary_type': boundary_type.to_str(),
                'observation_id': observation_id.to_str(),
                'observation': observation.to_dict()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_boundary_type(self) -> BoundaryType:
        return BoundaryType.from_str(self.payload['boundary_type'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    def get_observation(self) -> Observation:
        return ObservationFactory.from_dict(boundary_type=self.get_boundary_type(), data=self.payload['observation'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_OBSERVATION_UPDATED.to_str())


class ModelBoundaryObservationGeometryRecalculatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, boundary_id: BoundaryId,
                   observation_id: ObservationId, observation_geometry: Point, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'boundary_id': boundary_id.to_str(),
                'observation_id': observation_id.to_str(),
                'observation_geometry': observation_geometry.to_dict()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_boundary_id(self) -> BoundaryId:
        return BoundaryId.from_str(self.payload['boundary_id'])

    def get_observation_id(self) -> ObservationId:
        return ObservationId.from_str(self.payload['observation_id'])

    def get_observation_geometry(self) -> Point:
        return Point.from_dict(self.payload['observation_geometry'])

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelBoundaryEventName.MODEL_BOUNDARY_OBSERVATION_GEOMETRY_RECALCULATED.to_str())
