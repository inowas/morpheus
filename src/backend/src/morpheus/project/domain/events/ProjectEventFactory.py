from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventName import EventName
from ...domain.events.ProjectEventName import ProjectEventName

from ...domain.events.ModelEvents import ModelCreatedEvent, VersionAssignedToModelEvent, VersionCreatedEvent, VersionDeletedEvent, VersionDescriptionUpdatedEvent, \
    ModelAffectedCellsUpdatedEvent, ModelGeometryUpdatedEvent, ModelGridUpdatedEvent, ModelTimeDiscretizationUpdatedEvent, ModelAffectedCellsRecalculatedEvent, \
    ModelGridRecalculatedEvent
from ...domain.events.PermissionEvents import MemberAddedEvent, MemberRemovedEvent, MemberRoleUpdatedEvent, VisibilityUpdatedEvent, OwnershipUpdatedEvent
from ...domain.events.ProjectEvents import ProjectCreatedEvent, ProjectMetadataUpdatedEvent, ProjectDeletedEvent


class ProjectEventFactory:
    def create_event(self, event_name: EventName, entity_uuid: Uuid, occurred_at: DateTime, payload: dict):
        if event_name.to_str() == ProjectEventName.MODEL_AFFECTED_CELLS_RECALCULATED:
            return ModelAffectedCellsRecalculatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.MODEL_AFFECTED_CELLS_UPDATED:
            return ModelAffectedCellsUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.MODEL_CREATED:
            return ModelCreatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.MODEL_GEOMETRY_UPDATED:
            return ModelGeometryUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.MODEL_GRID_RECALCULATED:
            return ModelGridRecalculatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.MODEL_GRID_UPDATED:
            return ModelGridUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.MODEL_TIME_DISCRETIZATION_UPDATED:
            return ModelTimeDiscretizationUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.PROJECT_MEMBER_ADDED:
            return MemberAddedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.PROJECT_MEMBER_REMOVED:
            return MemberRemovedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.PROJECT_MEMBER_ROLE_UPDATED:
            return MemberRoleUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.PROJECT_OWNERSHIP_UPDATED:
            return OwnershipUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.PROJECT_CREATED:
            return ProjectCreatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.PROJECT_DELETED:
            return ProjectDeletedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.PROJECT_METADATA_UPDATED:
            return ProjectMetadataUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.VERSION_ASSIGNED_TO_MODEL:
            return VersionAssignedToModelEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.VERSION_CREATED:
            return VersionCreatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.VERSION_DELETED:
            return VersionDeletedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.VERSION_DESCRIPTION_UPDATED:
            return VersionDescriptionUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ProjectEventName.VISIBILITY_UPDATED:
            return VisibilityUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)

        raise ValueError(f'Unknown event name: {event_name}')


project_event_factory = ProjectEventFactory()
