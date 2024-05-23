from morpheus.common.application.Projector import ProjectorBase
from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.domain.events.ProjectEvents.ProjectEvents import ProjectPreviewImageUpdatedEvent, ProjectPreviewImageDeletedEvent, ProjectDeletedEvent
from morpheus.project.infrastructure.persistence.PreviewImageRepository import PreviewImageRepository, preview_image_repository


class PreviewImageProjector(EventListenerBase, ProjectorBase):

    def __init__(self, repository: PreviewImageRepository):
        self.repository = repository

    def reset(self) -> None:
        self.repository.remove_all_documents()

    @listen_to(ProjectPreviewImageUpdatedEvent)
    def on_preview_image_updated(self, event: ProjectPreviewImageUpdatedEvent, metadata: EventMetadata):
        self.repository.update_preview_image(project_id=event.get_project_id(), asset_id=event.get_asset_id())

    @listen_to(ProjectPreviewImageDeletedEvent)
    def on_preview_image_deleted(self, event: ProjectPreviewImageDeletedEvent, metadata: EventMetadata):
        self.repository.delete_preview_image(project_id=event.get_project_id())

    @listen_to(ProjectDeletedEvent)
    def on_project_deleted(self, event: ProjectDeletedEvent, metadata: EventMetadata):
        self.repository.delete_preview_image(project_id=event.get_project_id())


preview_image_projector = PreviewImageProjector(preview_image_repository)
