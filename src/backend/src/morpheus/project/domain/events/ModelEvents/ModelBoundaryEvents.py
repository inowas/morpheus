from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.boundaries.Boundary import Boundary, BoundaryId

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
