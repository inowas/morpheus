from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.domain.events.ModelEvents import ModelCreatedEvent, VersionAssignedToModelEvent, VersionCreatedEvent, VersionDescriptionUpdatedEvent, \
    VersionDeletedEvent, ModelGeometryUpdatedEvent, ModelGridUpdatedEvent, ModelAffectedCellsUpdatedEvent, ModelTimeDiscretizationUpdatedEvent, \
    ModelAffectedCellsRecalculatedEvent, ModelGridRecalculatedEvent, ModelLayerCreatedEvent, ModelLayerDeletedEvent, ModelLayerUpdatedEvent, ModelLayerPropertyUpdatedEvent
from morpheus.project.domain.events.ProjectEvents import ProjectCreatedEvent, ProjectDeletedEvent
from morpheus.project.infrastructure.persistence.ModelRepository import ModelRepository, model_repository
from morpheus.project.infrastructure.persistence.ModelVersionTagRepository import ModelVersionTagRepository, model_version_tag_repository
from morpheus.project.types.User import UserId


class ModelProjector(EventListenerBase):

    def __init__(self, model_repo: ModelRepository, model_version_tag_repo: ModelVersionTagRepository) -> None:
        self.model_repo = model_repo
        self.model_version_repo = model_version_tag_repo

    @listen_to(ProjectCreatedEvent)
    def on_project_created(self, event: ProjectCreatedEvent, metadata: EventMetadata) -> None:
        project = event.get_project()
        project_id = project.project_id
        model = project.model
        if model is None:
            return

        created_by = UserId.from_str(metadata.get_created_by().to_str())
        created_at = event.get_occurred_at()

        self.model_repo.save_model(project_id=project_id, model=model, created_at=created_at, created_by=created_by)

    @listen_to(ProjectDeletedEvent)
    def on_project_deleted(self, event: ProjectDeletedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        self.model_repo.delete_model(project_id=project_id)

    @listen_to(ModelAffectedCellsRecalculatedEvent)
    def on_model_affected_cells_recalculated(self, event: ModelAffectedCellsRecalculatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        affected_cells = event.get_affected_cells()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_affected_cells(affected_cells=affected_cells))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelAffectedCellsUpdatedEvent)
    def on_model_affected_cells_updated(self, event: ModelAffectedCellsUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        affected_cells = event.get_affected_cells()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_affected_cells(affected_cells=affected_cells))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelCreatedEvent)
    def on_model_created(self, event: ModelCreatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model = event.get_model()

        created_by = UserId.from_str(metadata.get_created_by().to_str())
        created_at = event.get_occurred_at()

        self.model_repo.save_model(project_id=project_id, model=model, created_at=created_at, created_by=created_by)

    @listen_to(ModelGeometryUpdatedEvent)
    def on_model_geometry_updated(self, event: ModelGeometryUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        geometry = event.get_geometry()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_geometry(geometry=geometry))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelGridRecalculatedEvent)
    def on_model_grid_recalculated(self, event: ModelGridUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        grid = event.get_grid()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_grid(grid=grid))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelGridUpdatedEvent)
    def on_model_grid_updated(self, event: ModelGridUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        grid = event.get_grid()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)
        latest = latest.with_updated_spatial_discretization(spatial_discretization=latest.spatial_discretization.with_updated_grid(grid=grid))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelTimeDiscretizationUpdatedEvent)
    def on_model_time_discretization_updated(self, event: ModelTimeDiscretizationUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        time_discretization = event.get_time_discretization()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)
        latest = latest.with_updated_time_discretization(time_discretization=time_discretization)
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelLayerCreatedEvent)
    def on_model_layer_created(self, event: ModelLayerCreatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        layer = event.get_layer()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        layers = latest_model.layers
        if layers is None:
            return

        new_layers = layers.with_added_layer(layer=layer)
        updated_model = latest_model.with_updated_layers(layers=new_layers)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelLayerDeletedEvent)
    def on_model_layer_deleted(self, event: ModelLayerDeletedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        layer_id = event.get_layer_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)

        if latest.model_id != model_id:
            return

        layers = latest.layers
        if layers is None:
            return

        latest = latest.with_updated_layers(layers=layers.with_deleted_layer(layer_id=layer_id))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelLayerUpdatedEvent)
    def on_model_layer_updated(self, event: ModelLayerUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        layer_id = event.get_layer_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)

        if latest.model_id != model_id:
            return

        layers = latest.layers
        if layers is None:
            return

        layer = latest.layers.get_layer(layer_id=layer_id)
        if layer is None:
            return

        layer_name = event.get_layer_name()
        if layer_name is not None:
            layer = layer.with_updated_name(layer_name=layer_name)

        layer_description = event.get_layer_description()
        if layer_description is not None:
            layer = layer.with_updated_description(layer_description=layer_description)

        layer_type = event.get_layer_type()
        if layer_type is not None:
            layer = layer.with_updated_type(layer_type=layer_type)

        latest = latest.with_updated_layers(layers=layers.with_updated_layer(updated_layer=layer))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelLayerPropertyUpdatedEvent)
    def on_model_layer_property_updated(self, event: ModelLayerPropertyUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        layer_id = event.get_layer_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)

        if latest.model_id != model_id:
            return

        layers = latest.layers
        if layers is None:
            return

        layer = latest.layers.get_layer(layer_id=layer_id)
        if layer is None:
            return

        layer = layer.with_updated_property(property_name=event.get_property_name(), property_value=event.get_property_value())

        latest = latest.with_updated_layers(layers=layers.with_updated_layer(updated_layer=layer))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(VersionCreatedEvent)
    def on_version_created(self, event: VersionCreatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        version = event.get_version()

        created_by = UserId.from_str(metadata.get_created_by().to_str())
        created_at = event.get_occurred_at()

        self.model_version_repo.create_new_version(project_id=project_id, version=version, created_by=created_by, created_at=created_at)

    @listen_to(VersionDescriptionUpdatedEvent)
    def on_version_description_updated(self, event: VersionDescriptionUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        version_id = event.get_version_id()
        description = event.get_description()

        self.model_version_repo.update_version_description(project_id=project_id, version_id=version_id, description=description)

    @listen_to(VersionAssignedToModelEvent)
    def on_latest_model_version_tagged(self, event: VersionAssignedToModelEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        version_id = event.get_version_id()

        version = self.model_version_repo.get_version_by_id(project_id=project_id, version_id=version_id)

        changed_by = UserId.from_str(metadata.get_created_by().to_str())
        changed_at = event.get_occurred_at()

        self.model_repo.assign_version_to_latest_model(project_id=project_id, version=version, changed_by=changed_by, changed_at=changed_at)

    @listen_to(VersionDeletedEvent)
    def on_version_deleted(self, event: VersionDeletedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        version_id = event.get_version_id()

        self.model_version_repo.delete_version_by_id(project_id=project_id, version_id=version_id)
        self.model_repo.delete_version(project_id=project_id, version_id=version_id)


model_projector = ModelProjector(model_repo=model_repository, model_version_tag_repo=model_version_tag_repository)
