from morpheus.project.domain.events.CalculationEvents.CalculationProfileAddedEvent import CalculationProfileAddedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationProfileRemovedEvent import CalculationProfileRemovedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationProfileUpdatedEvent import CalculationProfileUpdatedEvent

calculation_event_list = [
    CalculationProfileAddedEvent,
    CalculationProfileRemovedEvent,
    CalculationProfileUpdatedEvent,
]


def get_calculation_event_list():
    return calculation_event_list
