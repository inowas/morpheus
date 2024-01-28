from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types import DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import OccurredAt
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.modflow.domain.events.BaseModelEvents import BaseModelCreatedEvent, LatestBaseModelVersionedEvent
from morpheus.modflow.domain.events.ProjectEvents import ProjectCreatedEvent
from morpheus.modflow.infrastructure.persistence.BaseModelRepository import BaseModelRepository, base_model_repository
from morpheus.modflow.infrastructure.persistence.BaseModelVersionRepository import BaseModelVersionRepository, base_model_version_repository
from morpheus.modflow.types.User import UserId


class BaseModelProjector(EventListenerBase):

    def __init__(self, base_model_repo: BaseModelRepository, base_model_version_repo: BaseModelVersionRepository) -> None:
        self.base_model_repo = base_model_repo
        self.base_model_version_repo = base_model_version_repo

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata, occurred_at: OccurredAt) -> None:
        project = event.get_project()
        project_id = project.project_id
        base_model = project.base_model
        if base_model is None:
            return

        changed_by = UserId.from_str(metadata.created_by)
        changed_at = DateTime.from_datetime(occurred_at.to_datetime())

        self.base_model_repo.save_base_model(project_id=project_id, base_model=base_model, changed_by=changed_by, changed_at=changed_at)

    @listen_to(BaseModelCreatedEvent)
    def on_base_model_created(self, event: BaseModelCreatedEvent, metadata: EventMetadata, occurred_at: OccurredAt) -> None:
        project_id = event.get_project_id()
        base_model = event.get_base_model()

        changed_by = UserId.from_str(metadata.created_by)
        changed_at = DateTime.from_datetime(occurred_at.to_datetime())

        self.base_model_repo.save_base_model(project_id=project_id, base_model=base_model, changed_by=changed_by, changed_at=changed_at)

    @listen_to(LatestBaseModelVersionedEvent)
    def on_latest_base_model_version_tagged(self, event: LatestBaseModelVersionedEvent, metadata: EventMetadata, occurred_at: OccurredAt) -> None:
        project_id = event.get_project_id()
        version = event.get_version()
        changed_by = UserId.from_str(metadata.created_by)
        changed_at = DateTime.from_datetime(occurred_at.to_datetime())

        latest_base_model_hash = self.base_model_repo.get_latest_base_model_hash(project_id=project_id)
        self.base_model_version_repo.create_new_version(project_id=project_id, version=version, sha1_hash=latest_base_model_hash, created_by=changed_by, created_at=changed_at)
        self.base_model_repo.assign_version_to_latest_base_model(project_id=project_id, version=version, changed_by=changed_by, changed_at=changed_at)


base_model_projector = BaseModelProjector(base_model_repo=base_model_repository, base_model_version_repo=base_model_version_repository)
