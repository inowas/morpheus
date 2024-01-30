from morpheus.common.infrastructure.event_sourcing.EventBus import EventBus
from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.modflow.application.projectors.BaseModelProjector import base_model_projector
from morpheus.modflow.application.projectors.ProjectSummaryProjector import project_summary_projector
from morpheus.modflow.application.projectors.PermissionsProjector import permissions_projector

from morpheus.modflow.infrastructure.event_sourcing.ModflowEventStore import modflow_event_store


def create_event_bus():
    event_publisher = EventPublisher()
    event_publisher.register(event_listener=project_summary_projector)
    event_publisher.register(event_listener=base_model_projector)
    event_publisher.register(event_listener=permissions_projector)

    return EventBus(event_publisher=event_publisher, event_store=modflow_event_store)


modflow_event_bus = create_event_bus()
