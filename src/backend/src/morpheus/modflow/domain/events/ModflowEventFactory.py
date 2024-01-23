from morpheus.common.types import Uuid
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.modflow.domain.events.ModflowEventName import ModflowEventName
from morpheus.modflow.domain.events.ProjectCreatedEvent import ProjectCreatedEvent


class ModflowEventFactory:
    def create_event(self, event_name: EventName, entity_uuid: Uuid, payload: dict):
        if event_name.to_str() == ModflowEventName.PROJECT_CREATED:
            return ProjectCreatedEvent(entity_uuid=entity_uuid, payload=payload)

        raise ValueError(f'Unknown event name: {event_name}')


modflow_event_factory = ModflowEventFactory()
