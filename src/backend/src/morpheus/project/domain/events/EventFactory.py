from typing import Type

from morpheus.common.infrastructure.event_sourcing.EventFactory import EventRegistry, EventFactory
from morpheus.project.domain.events.CalculationEvents import get_calculation_event_list
from morpheus.project.domain.events.ModelEvents import get_model_event_list
from morpheus.project.domain.events.ProjectEvents import get_project_event_list
from morpheus.project.domain.events.ProjectPermissionEvents import get_project_permissions_event_list

event_registry = EventRegistry()

for event in get_calculation_event_list():
    event_registry.register_event(event)
for event in get_model_event_list():
    event_registry.register_event(event)
for event in get_project_event_list():
    event_registry.register_event(event)
for event in get_project_permissions_event_list():
    event_registry.register_event(event)

project_event_factory = EventFactory(registry=event_registry)
