from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.modflow.domain.events.BaseModelEvents import BaseModelCreatedEvent, VersionAssignedToBaseModelEvent, VersionCreatedEvent, VersionDescriptionUpdatedEvent, \
    VersionDeletedEvent, BaseModelGeometryUpdatedEvent, BaseModelGridUpdatedEvent, BaseModelAffectedCellsUpdatedEvent, BaseModelTimeDiscretizationUpdatedEvent, \
    BaseModelAffectedCellsRecalculatedEvent
from morpheus.modflow.domain.events.ProjectEvents import ProjectCreatedEvent
from morpheus.modflow.infrastructure.persistence.BaseModelRepository import BaseModelRepository, base_model_repository
from morpheus.modflow.infrastructure.persistence.BaseModelVersionTagRepository import BaseModelVersionTagRepository, base_model_version_tag_repository
from morpheus.modflow.types.User import UserId


class BaseModelProjector(EventListenerBase):

    def __init__(self, base_model_repo: BaseModelRepository, base_model_version_tag_repo: BaseModelVersionTagRepository) -> None:
        self.base_model_repo = base_model_repo
        self.base_model_version_repo = base_model_version_tag_repo

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata) -> None:
        project = event.get_project()
        project_id = project.project_id
        base_model = project.base_model
        if base_model is None:
            return

        created_by = UserId.from_str(metadata.get_created_by().to_str())
        created_at = event.get_occurred_at()

        self.base_model_repo.save_base_model(project_id=project_id, base_model=base_model, created_at=created_at, created_by=created_by)

    @listen_to(BaseModelAffectedCellsRecalculatedEvent)
    def on_base_model_affected_cells_recalculated(self, event: BaseModelAffectedCellsRecalculatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        affected_cells = event.get_affected_cells()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.base_model_repo.get_latest_base_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_affected_cells(affected_cells=affected_cells))
        self.base_model_repo.update_base_model(project_id=project_id, base_model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(BaseModelAffectedCellsUpdatedEvent)
    def on_base_model_affected_cells_updated(self, event: BaseModelAffectedCellsUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        affected_cells = event.get_affected_cells()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.base_model_repo.get_latest_base_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_affected_cells(affected_cells=affected_cells))
        self.base_model_repo.update_base_model(project_id=project_id, base_model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(BaseModelCreatedEvent)
    def on_base_model_created(self, event: BaseModelCreatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        base_model = event.get_base_model()

        created_by = UserId.from_str(metadata.get_created_by().to_str())
        created_at = event.get_occurred_at()

        self.base_model_repo.save_base_model(project_id=project_id, base_model=base_model, created_at=created_at, created_by=created_by)

    @listen_to(BaseModelGeometryUpdatedEvent)
    def on_base_model_geometry_updated(self, event: BaseModelGeometryUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        geometry = event.get_geometry()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.base_model_repo.get_latest_base_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_geometry(geometry=geometry))
        self.base_model_repo.update_base_model(project_id=project_id, base_model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(BaseModelGridUpdatedEvent)
    def on_base_model_grid_updated(self, event: BaseModelGridUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        grid = event.get_grid()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.base_model_repo.get_latest_base_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_grid(grid=grid))
        self.base_model_repo.update_base_model(project_id=project_id, base_model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(BaseModelTimeDiscretizationUpdatedEvent)
    def on_base_model_time_discretization_updated(self, event: BaseModelTimeDiscretizationUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        time_discretization = event.get_time_discretization()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.base_model_repo.get_latest_base_model(project_id=project_id)
        latest = latest.with_updated_time_discretization(time_discretization=time_discretization)
        self.base_model_repo.update_base_model(project_id=project_id, base_model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(VersionCreatedEvent)
    def on_version_created(self, event: VersionCreatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        version = event.get_version()

        created_by = UserId.from_str(metadata.get_created_by().to_str())
        created_at = event.get_occurred_at()

        self.base_model_version_repo.create_new_version(project_id=project_id, version=version, created_by=created_by, created_at=created_at)

    @listen_to(VersionDescriptionUpdatedEvent)
    def on_version_description_updated(self, event: VersionDescriptionUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        version_id = event.get_version_id()
        description = event.get_description()

        self.base_model_version_repo.update_version_description(project_id=project_id, version_id=version_id, description=description)

    @listen_to(VersionAssignedToBaseModelEvent)
    def on_latest_base_model_version_tagged(self, event: VersionAssignedToBaseModelEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        version_id = event.get_version_id()

        version = self.base_model_version_repo.get_version_by_id(project_id=project_id, version_id=version_id)

        changed_by = UserId.from_str(metadata.get_created_by().to_str())
        changed_at = event.get_occurred_at()

        self.base_model_repo.assign_version_to_latest_base_model(project_id=project_id, version=version, changed_by=changed_by, changed_at=changed_at)

    @listen_to(VersionDeletedEvent)
    def on_version_deleted(self, event: VersionDeletedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        version_id = event.get_version_id()

        self.base_model_version_repo.delete_version_by_id(project_id=project_id, version_id=version_id)
        self.base_model_repo.delete_version(project_id=project_id, version_id=version_id)


base_model_projector = BaseModelProjector(base_model_repo=base_model_repository, base_model_version_tag_repo=base_model_version_tag_repository)
