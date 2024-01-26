from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.modflow.domain.events.BaseModelEvents import BaseModelCreatedEvent
from morpheus.modflow.domain.events.ProjectEvents import ProjectCreatedEvent
from morpheus.modflow.infrastructure.persistence.BaseModelRepository import BaseModelRepository, base_model_repository


class BaseModelProjector(EventListenerBase):

    def __init__(self, repository: BaseModelRepository):
        self.repository = repository

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata):
        project = event.get_project()
        project_id = project.project_id
        base_model = project.base_model
        if base_model is None:
            return

        self.repository.save_non_existent_model(project_id=project_id, base_model=base_model)

    @listen_to(BaseModelCreatedEvent)
    def on_base_model_created(self, event: BaseModelCreatedEvent, metadata: EventMetadata):
        project_id = event.get_project_id()
        base_model = event.get_base_model()
        self.repository.save_non_existent_model(project_id=project_id, base_model=base_model)


base_model_projector = BaseModelProjector(repository=base_model_repository)
