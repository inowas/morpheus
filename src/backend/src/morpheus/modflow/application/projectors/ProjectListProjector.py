from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.modflow.domain.events.ProjectCreatedEvent import ProjectCreatedEvent
from morpheus.modflow.infrastructure.persistence.ProjectListProjectionRepository import ProjectListProjectionRepository, project_list_projection_repository
from morpheus.modflow.types.projections.ListProjectItem import ListProjectItem


class ProjectListProjector:

    def __init__(self, repository: ProjectListProjectionRepository):
        self.repository = repository

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata):
        project_list_item = ListProjectItem(
            project_id=event.get_payload().project_id,
            project_name=event.get_payload().project_name,
        )
        self.repository.insert(project_list_item)


project_list_projector = ProjectListProjector(project_list_projection_repository)
