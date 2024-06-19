from morpheus.project.domain.events.CalculationEvents.CalculationCanceledEvent import CalculationCanceledEvent
from morpheus.project.domain.events.CalculationEvents.CalculationCompletedEvent import CalculationCompletedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationCreatedEvent import CalculationCreatedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationDeletedEvent import CalculationDeletedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationFailedEvent import CalculationFailedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationProfileAddedEvent import CalculationProfileAddedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationProfileRemovedEvent import CalculationProfileRemovedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationProfileUpdatedEvent import CalculationProfileUpdatedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationStartedEvent import CalculationStartedEvent

calculation_event_list = [
    CalculationCanceledEvent,
    CalculationCompletedEvent,
    CalculationCreatedEvent,
    CalculationDeletedEvent,
    CalculationFailedEvent,
    CalculationProfileAddedEvent,
    CalculationProfileRemovedEvent,
    CalculationProfileUpdatedEvent,
    CalculationStartedEvent,
]


def get_calculation_event_list():
    return calculation_event_list
