from morpheus.common.infrastructure.event_sourcing.EventBus import EventBus
from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.common.infrastructure.event_sourcing.EventStore import EventStore
from morpheus.modflow.application.projectors.ProjectListProjector import project_list_projector
from morpheus.modflow.application.projectors.BaseModelProjector import base_model_projector
from morpheus.modflow.infrastructure.persistence.ModflowEventStoreRepository import modflow_event_store_repository


def create_event_bus():
    event_publisher = EventPublisher()
    event_publisher.register(event_listener=project_list_projector)
    event_publisher.register(event_listener=base_model_projector)

    event_store = EventStore(event_store_repository=modflow_event_store_repository)

    return EventBus(event_publisher=event_publisher, event_store=event_store)


modflow_event_bus = create_event_bus()
