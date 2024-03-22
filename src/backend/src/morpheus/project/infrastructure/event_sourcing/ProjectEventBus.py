from morpheus.common.infrastructure.event_sourcing.EventBus import EventBus
from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.project.application.projectors.ModelProjector import model_projector
from morpheus.project.application.projectors.ProjectSummaryProjector import project_summary_projector
from morpheus.project.application.projectors.PermissionsProjector import permissions_projector

from morpheus.project.infrastructure.event_sourcing.ProjectEventStore import project_event_store


def create_event_bus():
    event_publisher = EventPublisher()
    event_publisher.register(event_listener=project_summary_projector)
    event_publisher.register(event_listener=model_projector)
    event_publisher.register(event_listener=permissions_projector)

    return EventBus(event_publisher=event_publisher, event_store=project_event_store)


project_event_bus = create_event_bus()