from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.modflow.domain.events.ProjectCreatedEvent import ProjectCreatedEvent
from morpheus.modflow.infrastructure.persistence.BaseModelProjection import BaseModelProjection, base_model_projection


class BaseModelProjector(EventListenerBase):

    def __init__(self, repository: BaseModelProjection):
        self.repository = repository

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata):
        project = event.get_project()
        project_id = project.project_id
        base_model = project.base_model
        if base_model is None:
            return

        self.repository.save_or_update_base_model(project_id=project_id, base_model=base_model)


base_model_projector = BaseModelProjector(repository=base_model_projection)
