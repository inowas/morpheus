from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.modflow.domain.events.ProjectCreatedEvent import ProjectCreatedEvent
from morpheus.modflow.infrastructure.persistence.ProjectListRepository import ProjectListRepository, project_list_repository
from morpheus.modflow.types.Project import ProjectSummary


class ProjectListProjector(EventListenerBase):

    def __init__(self, repository: ProjectListRepository):
        self.repository = repository

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata):
        project_summary = ProjectSummary(
            project_id=event.get_project().project_id,
            project_name=event.get_project().settings.metadata.name,
            project_description=event.get_project().settings.metadata.description,
            project_tags=event.get_project().settings.metadata.tags,
            owner_id=event.get_project().settings.members.get_owner_id(),
        )
        self.repository.insert_or_update(summary=project_summary)


project_list_projector = ProjectListProjector(project_list_repository)
