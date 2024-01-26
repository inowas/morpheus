from morpheus.common.application.Projector import ProjectorBase
from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.modflow.domain.events.ProjectEvents import ProjectCreatedEvent, ProjectMetadataUpdatedEvent
from morpheus.modflow.infrastructure.persistence.ProjectSummaryProjection import ProjectSummaryProjection, project_summary_projection
from morpheus.modflow.types.Project import ProjectSummary


class ProjectSummaryProjector(EventListenerBase, ProjectorBase):

    def __init__(self, repository: ProjectSummaryProjection):
        self.repository = repository

    def reset(self) -> None:
        self.repository.remove_all_documents()

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata):
        project_summary = ProjectSummary(
            project_id=event.get_project().project_id,
            project_name=event.get_project().metadata.name,
            project_description=event.get_project().metadata.description,
            project_tags=event.get_project().metadata.tags,
            owner_id=event.get_project().permissions.owner_id,
        )
        self.repository.insert_or_update(summary=project_summary)

    @listen_to(ProjectMetadataUpdatedEvent)
    def on_project_metadata_updated(self, event: ProjectMetadataUpdatedEvent, metadata: EventMetadata):
        project_id = event.get_project_id()
        project_summary = self.repository.get_summary(project_id)
        if project_summary is None:
            raise Exception(f'Could not find project summary for project with id {project_id.to_str()}')

        name = event.get_name()
        if name is not None:
            project_summary = project_summary.with_name(name=name)

        description = event.get_description()
        if description is not None:
            project_summary = project_summary.with_description(description=description)

        tags = event.get_tags()
        if tags is not None:
            project_summary = project_summary.with_tags(tags=tags)

        self.repository.insert_or_update(summary=project_summary)


project_summary_projector = ProjectSummaryProjector(project_summary_projection)
