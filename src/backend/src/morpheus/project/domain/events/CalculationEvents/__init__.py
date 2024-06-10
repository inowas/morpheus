from morpheus.project.domain.events.CalculationEvents.CalculationCanceledEvent import CalculationCanceledEvent
from morpheus.project.domain.events.CalculationEvents.CalculationCompletedEvent import CalculationCompletedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationFailedEvent import CalculationFailedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationQueuedEvent import CalculationQueuedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationStartedEvent import CalculationStartedEvent

calculation_event_list = [
    CalculationCanceledEvent,
    CalculationCompletedEvent,
    CalculationFailedEvent,
    CalculationQueuedEvent,
    CalculationStartedEvent,
]


def get_calculation_event_list():
    return calculation_event_list
