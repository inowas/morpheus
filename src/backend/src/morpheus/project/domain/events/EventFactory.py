from typing import Type

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.domain.events.CalculationEvents import get_calculation_event_list
from morpheus.project.domain.events.ModelEvents import get_model_event_list
from morpheus.project.domain.events.ProjectEvents import get_project_event_list
from morpheus.project.domain.events.ProjectPermissionEvents import get_project_permissions_event_list


class EventRegistry:
    def __init__(self):
        self._event_registry = {}

    def register_event(self, event_to_register: Type[EventBase]):
        if event_to_register.get_event_name().to_str() in self._event_registry:
            raise ValueError(f'Duplicate event name: {event_to_register.get_event_name().to_str()}')
        self._event_registry[event_to_register.get_event_name().to_str()] = event

    def get_event_by_name(self, name: EventName) -> Type[EventBase] | None:
        return self._event_registry.get(name.to_str())


class ProjectEventFactory:
    _registry: EventRegistry

    def __init__(self, registry: EventRegistry):
        self._registry = registry

    def create_event(self, event_name: EventName, entity_uuid: Uuid, occurred_at: DateTime, payload: dict):
        event_class = self._registry.get_event_by_name(name=event_name)
        if event_class is None:
            raise ValueError(f'Unknown event name: {event_name}')

        return event_class.create(entity_uuid, occurred_at, payload)


event_registry = EventRegistry()

for event in get_calculation_event_list():
    event_registry.register_event(event)
for event in get_model_event_list():
    event_registry.register_event(event)
for event in get_project_event_list():
    event_registry.register_event(event)
for event in get_project_permissions_event_list():
    event_registry.register_event(event)

project_event_factory = ProjectEventFactory(registry=event_registry)
