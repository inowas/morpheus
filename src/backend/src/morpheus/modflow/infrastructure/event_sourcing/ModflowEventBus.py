from morpheus.common.infrastructure.event_sourcing.EventBus import EventBus
from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.common.infrastructure.event_sourcing.EventStore import EventStore
from morpheus.modflow.application.projectors.ProjectSummaryProjector import project_summary_projector
from morpheus.modflow.application.projectors.BaseModelProjector import base_model_projector
from morpheus.modflow.infrastructure.persistence.ModflowEventStore import modflow_event_store


def create_event_bus():
    event_publisher = EventPublisher()
    event_publisher.register(event_listener=project_summary_projector)
    event_publisher.register(event_listener=base_model_projector)

    event_store = EventStore(event_store_repository=modflow_event_store)

    return EventBus(event_publisher=event_publisher, event_store=event_store)


modflow_event_bus = create_event_bus()
