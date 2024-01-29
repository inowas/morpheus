from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventName import EventName
from ...domain.events.ModflowEventName import ModflowEventName

from ...domain.events.BaseModelEvents import BaseModelCreatedEvent, VersionAssignedToBaseModelEvent, VersionCreatedEvent, VersionDeletedEvent, VersionDescriptionUpdatedEvent
from ...domain.events.PermissionEvents import MemberAddedEvent, MemberRemovedEvent, MemberRoleUpdatedEvent, VisibilityUpdatedEvent, OwnershipUpdatedEvent
from ...domain.events.ProjectEvents import ProjectCreatedEvent, ProjectMetadataUpdatedEvent


class ModflowEventFactory:
    def create_event(self, event_name: EventName, entity_uuid: Uuid, occurred_at: DateTime, payload: dict):
        if event_name.to_str() == ModflowEventName.BASE_MODEL_CREATED:
            return BaseModelCreatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.MEMBER_ADDED:
            return MemberAddedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.MEMBER_REMOVED:
            return MemberRemovedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.MEMBER_ROLE_UPDATED:
            return MemberRoleUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.OWNERSHIP_UPDATED:
            return OwnershipUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.PROJECT_CREATED:
            return ProjectCreatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.PROJECT_METADATA_UPDATED:
            return ProjectMetadataUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.VERSION_ASSIGNED_TO_BASEMODEL:
            return VersionAssignedToBaseModelEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.VERSION_CREATED:
            return VersionCreatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.VERSION_DELETED:
            return VersionDeletedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.VERSION_DESCRIPTION_UPDATED:
            return VersionDescriptionUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)
        if event_name.to_str() == ModflowEventName.VISIBILITY_UPDATED:
            return VisibilityUpdatedEvent(entity_uuid=entity_uuid, occurred_at=occurred_at, payload=payload)

        raise ValueError(f'Unknown event name: {event_name}')


modflow_event_factory = ModflowEventFactory()
