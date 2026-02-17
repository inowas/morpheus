from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.domain.events.ModelEvents.GeneralModelEvents import VersionDeletedEvent, VersionAssignedToModelEvent, VersionDescriptionUpdatedEvent, VersionCreatedEvent, \
    ModelCreatedEvent
import morpheus.project.domain.events.ModelEvents.ModelBoundaryEvents as ModelBoundaryEvents
import morpheus.project.domain.events.ModelEvents.ModelObservationEvents as ModelObservationEvents
from morpheus.project.domain.events.ModelEvents.ModelDiscretizationEvents import ModelAffectedCellsRecalculatedEvent, ModelTimeDiscretizationUpdatedEvent, ModelGridUpdatedEvent, \
    ModelGridRecalculatedEvent, ModelGeometryUpdatedEvent, ModelAffectedCellsUpdatedEvent
from morpheus.project.domain.events.ModelEvents.ModelLayerEvents import ModelLayerPropertyUpdatedEvent, ModelLayerMetadataUpdatedEvent, ModelLayerOrderUpdatedEvent, \
    ModelLayerDeletedEvent, ModelLayerCreatedEvent, ModelLayerConfinementUpdatedEvent, ModelLayerClonedEvent, ModelLayerAddedEvent
from morpheus.project.domain.events.ProjectEvents.ProjectEvents import ProjectCreatedEvent, ProjectDeletedEvent
from morpheus.project.infrastructure.persistence.ModelRepository import ModelRepository, model_repository
from morpheus.project.infrastructure.persistence.ModelVersionTagRepository import ModelVersionTagRepository, model_version_tag_repository
from morpheus.project.types.layers.Layer import LayerPropertyValues, Layer


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

    @listen_to(ModelLayerAddedEvent)
    def on_model_layer_added(self, event: ModelLayerAddedEvent, metadata: EventMetadata) -> None:
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

        if not isinstance(layer, Layer):
            return

        new_layers = layers.with_added_layer(layer=layer)
        updated_model = latest_model.with_updated_layers(layers=new_layers)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelLayerClonedEvent)
    def on_model_layer_cloned(self, event: ModelLayerClonedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        layer_id = event.get_layer_id()
        new_layer_id = event.get_new_layer_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        layers = latest_model.layers
        if layers is None:
            return

        layer = layers.get_layer(layer_id=layer_id)
        if not isinstance(layer, Layer):
            return

        new_layer = layer.clone(layer_id=new_layer_id)
        new_layers = layers.with_added_layer(layer=new_layer)
        updated_model = latest_model.with_updated_layers(layers=new_layers)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelLayerConfinementUpdatedEvent)
    def on_model_layer_confinement_updated(self, event: ModelLayerConfinementUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        layer_id = event.get_layer_id()
        confinement = event.get_confinement()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        layers = latest_model.layers
        if layers is None:
            return

        layer = layers.get_layer(layer_id=layer_id)
        if not isinstance(layer, Layer):
            return

        layer = layer.with_updated_confinement(confinement=confinement)
        updated_layers = layers.with_updated_layer(updated_layer=layer)
        updated_model = latest_model.with_updated_layers(layers=updated_layers)
        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

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

    @listen_to(ModelLayerOrderUpdatedEvent)
    def on_model_layer_order_updated(self, event: ModelLayerOrderUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        order = event.get_order()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest = self.model_repo.get_latest_model(project_id=project_id)

        if latest.model_id != model_id:
            return

        layers = latest.layers
        if layers is None:
            return

        latest = latest.with_updated_layers(layers=layers.with_updated_order(layer_ids=order))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelLayerMetadataUpdatedEvent)
    def on_model_layer_metadata_updated(self, event: ModelLayerMetadataUpdatedEvent, metadata: EventMetadata) -> None:
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

        layer_property_values = layer.get_property_values(property_name=event.get_property_name())
        if layer_property_values is None:
            return

        default_value = layer_property_values.value
        if event.has_property_default_value():
            event_property_default_value = event.get_property_default_value()
            if event_property_default_value is not None:
                default_value = event_property_default_value

        raster = layer_property_values.raster
        if event.has_property_raster():
            raster = event.get_property_raster()

        zones = layer_property_values.zones
        if event.has_property_zones():
            zones = event.get_property_zones()

        new_property_values = LayerPropertyValues(
            value=default_value,
            raster=raster,
            zones=zones
        )

        layer = layer.with_updated_property(property_name=event.get_property_name(), property_values=new_property_values)
        latest = latest.with_updated_layers(layers=layers.with_updated_layer(updated_layer=layer))
        self.model_repo.update_model(project_id=project_id, model=latest, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundariesImportedEvent)
    def on_model_boundaries_imported(self, event: ModelBoundaryEvents.ModelBoundariesImportedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        new_boundaries = latest_model.boundaries.with_added_boundaries(boundaries=event.get_boundaries())
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)
        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundariesRemovedEvent)
    def on_model_boundaries_removed(self, event: ModelBoundaryEvents.ModelBoundariesRemovedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_ids = event.get_boundary_ids()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        new_boundaries = boundaries.with_removed_boundaries(boundary_ids=boundary_ids)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)
        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryAddedEvent)
    def on_model_boundary_added(self, event: ModelBoundaryEvents.ModelBoundaryAddedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary = event.get_boundary()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        new_boundaries = boundaries.with_added_boundary(boundary=boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryClonedEvent)
    def on_model_boundary_cloned(self, event: ModelBoundaryEvents.ModelBoundaryClonedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        new_boundary_id = event.get_new_boundary_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        new_boundary = boundary.with_new_id(boundary_id=new_boundary_id)
        new_boundaries = boundaries.with_added_boundary(boundary=new_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryAffectedCellsRecalculatedEvent)
    def on_model_boundary_affected_cells_recalculated(self, event: ModelBoundaryEvents.ModelBoundaryAffectedCellsUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        affected_cells = event.get_affected_cells()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_updated_affected_cells(affected_cells=affected_cells)
        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryAffectedCellsUpdatedEvent)
    def on_model_boundary_affected_cells_updated(self, event: ModelBoundaryEvents.ModelBoundaryAffectedCellsUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        affected_cells = event.get_affected_cells()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_updated_affected_cells(affected_cells=affected_cells)
        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryAffectedLayersUpdatedEvent)
    def on_model_boundary_affected_layers_updated(self, event: ModelBoundaryEvents.ModelBoundaryAffectedLayersUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_ids = event.get_boundary_ids()
        affected_layers = event.get_affected_layers()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        for boundary_id in boundary_ids:
            boundary = boundaries.get_boundary(boundary_id=boundary_id)
            if boundary is None:
                continue

            updated_boundary = boundary.with_updated_affected_layers(affected_layers=affected_layers)
            boundaries = boundaries.with_updated_boundary(update=updated_boundary)

        updated_model = latest_model.with_updated_boundaries(boundaries=boundaries)
        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryDisabledEvent)
    def on_model_boundary_disabled(self, event: ModelBoundaryEvents.ModelBoundaryDisabledEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_enabled(enabled=False)
        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryEnabledEvent)
    def on_model_boundary_enabled(self, event: ModelBoundaryEvents.ModelBoundaryEnabledEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_enabled(enabled=True)
        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryGeometryUpdatedEvent)
    def on_model_boundary_geometry_updated(self, event: ModelBoundaryEvents.ModelBoundaryGeometryUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        geometry = event.get_geometry()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_updated_geometry(geometry=geometry)
        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryInterpolationUpdatedEvent)
    def on_model_boundary_interpolation_updated(self, event: ModelBoundaryEvents.ModelBoundaryInterpolationUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_ids = event.get_boundary_ids()
        interpolation = event.get_interpolation()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        for boundary_id in boundary_ids:
            boundary = boundaries.get_boundary(boundary_id=boundary_id)
            if boundary is None:
                return

            updated_boundary = boundary.with_updated_interpolation(interpolation=interpolation)
            boundaries = boundaries.with_updated_boundary(update=updated_boundary)

        updated_model = latest_model.with_updated_boundaries(boundaries=boundaries)
        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryMetadataUpdatedEvent)
    def on_model_boundary_metadata_updated(self, event: ModelBoundaryEvents.ModelBoundaryMetadataUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        name = event.get_name()
        tags = event.get_tags()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_updated_name(name=name) if name is not None else boundary
        updated_boundary = updated_boundary.with_updated_tags(tags=tags) if tags is not None else updated_boundary

        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryObservationAddedEvent)
    def on_model_boundary_observation_added(self, event: ModelBoundaryEvents.ModelBoundaryObservationAddedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        observation = event.get_observation()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_added_observation(observation=observation)
        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryObservationGeometryRecalculatedEvent)
    def on_model_boundary_observation_geometry_recalculated(self, event: ModelBoundaryEvents.ModelBoundaryObservationGeometryRecalculatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        observation_id = event.get_observation_id()
        geometry = event.get_observation_geometry()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        observation = boundary.get_observation(observation_id=observation_id)
        if observation is None:
            return

        updated_observation = observation.with_updated_geometry(geometry=geometry)
        updated_boundary = boundary.with_updated_observation(observation_id=observation_id, update=updated_observation)

        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryObservationRemovedEvent)
    def on_model_boundary_observation_removed(self, event: ModelBoundaryEvents.ModelBoundaryObservationRemovedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        observation_id = event.get_observation_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_removed_observation(observation_id=observation_id)
        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryObservationUpdatedEvent)
    def on_model_boundary_observation_updated(self, event: ModelBoundaryEvents.ModelBoundaryObservationUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_id = event.get_boundary_id()
        observation_id = event.get_observation_id()
        observation = event.get_observation()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        boundary = boundaries.get_boundary(boundary_id=boundary_id)
        if boundary is None:
            return

        updated_boundary = boundary.with_updated_observation(observation_id=observation_id, update=observation)
        new_boundaries = boundaries.with_updated_boundary(update=updated_boundary)
        updated_model = latest_model.with_updated_boundaries(boundaries=new_boundaries)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelBoundaryEvents.ModelBoundaryTagsUpdatedEvent)
    def on_model_boundary_tags_updated(self, event: ModelBoundaryEvents.ModelBoundaryTagsUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        boundary_ids = event.get_boundary_ids()
        tags = event.get_tags()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        boundaries = latest_model.boundaries
        if boundaries is None:
            return

        for boundary_id in boundary_ids:
            boundary = boundaries.get_boundary(boundary_id=boundary_id)
            if boundary is None:
                continue

            updated_boundary = boundary.with_updated_tags(tags=tags)
            boundaries = boundaries.with_updated_boundary(update=updated_boundary)

        updated_model = latest_model.with_updated_boundaries(boundaries=boundaries)
        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelObservationEvents.ModelObservationAddedEvent)
    def on_model_observation_added(self, event: ModelObservationEvents.ModelObservationAddedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        observation = event.get_observation()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        observations = latest_model.observations
        if observations is None:
            return

        new_observations = observations.with_added_observation(observation=observation)
        updated_model = latest_model.with_updated_observations(observations=new_observations)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelObservationEvents.ModelObservationClonedEvent)
    def on_model_observation_cloned(self, event: ModelObservationEvents.ModelObservationClonedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        observation_id = event.get_observation_id()
        new_observation_id = event.get_new_observation_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)

        if latest_model.model_id != model_id:
            return

        observations = latest_model.observations
        if observations is None:
            return

        observation = observations.get_observation(id=observation_id)
        if observation is None:
            return

        new_observation = observation.with_updated_id(id=new_observation_id)
        new_observations = observations.with_added_observation(observation=new_observation)
        updated_model = latest_model.with_updated_observations(observations=new_observations)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelObservationEvents.ModelObservationEnabledEvent)
    def on_model_observation_enabled(self, event: ModelObservationEvents.ModelObservationEnabledEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        observation_id = event.get_observation_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)
        if latest_model.model_id != model_id:
            return

        observations = latest_model.observations
        if observations is None:
            return

        observation = observations.get_observation(id=observation_id)
        if observation is None:
            return

        updated_observation = observation.with_updated_enabled(enabled=True)
        new_observations = observations.with_updated_observation(observation=updated_observation)
        updated_model = latest_model.with_updated_observations(observations=new_observations)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelObservationEvents.ModelObservationDisabledEvent)
    def on_model_observation_disabled(self, event: ModelObservationEvents.ModelObservationDisabledEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        observation_id = event.get_observation_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)
        if latest_model.model_id != model_id:
            return

        observations = latest_model.observations
        if observations is None:
            return

        observation = observations.get_observation(id=observation_id)
        if observation is None:
            return

        updated_observation = observation.with_updated_enabled(enabled=False)
        new_observations = observations.with_updated_observation(observation=updated_observation)
        updated_model = latest_model.with_updated_observations(observations=new_observations)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelObservationEvents.ModelObservationUpdatedEvent)
    def on_model_observation_updated(self, event: ModelObservationEvents.ModelObservationUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)
        if latest_model.model_id != model_id:
            return

        observations = latest_model.observations
        if observations is None:
            return

        observation_to_update = observations.get_observation(id=event.get_observation_id())
        if observation_to_update is None:
            return

        observation_to_update = observation_to_update.with_updated_type(type=event.get_type())
        observation_to_update = observation_to_update.with_updated_name(name=event.get_name())
        observation_to_update = observation_to_update.with_updated_tags(tags=event.get_tags())
        observation_to_update = observation_to_update.with_updated_values(data=event.get_data())
        observation_to_update = observation_to_update.with_updated_geometry(geometry=event.get_geometry())
        observation_to_update = observation_to_update.with_updated_affected_cells(affected_cells=event.get_affected_cells())
        observation_to_update = observation_to_update.with_updated_affected_layers(affected_layers=event.get_affected_layers())
        observation_to_update = observation_to_update.with_updated_enabled(enabled=event.get_enabled())

        updated_observations = observations.with_updated_observation(observation=observation_to_update)
        updated_model = latest_model.with_updated_observations(observations=updated_observations)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

    @listen_to(ModelObservationEvents.ModelObservationRemovedEvent)
    def on_model_observation_removed(self, event: ModelObservationEvents.ModelObservationRemovedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        model_id = event.get_model_id()
        observation_id = event.get_observation_id()

        updated_by = UserId.from_str(metadata.get_created_by().to_str())
        updated_at = event.get_occurred_at()

        latest_model = self.model_repo.get_latest_model(project_id=project_id)
        if latest_model.model_id != model_id:
            return

        observations = latest_model.observations
        if observations is None:
            return

        new_observations = observations.with_removed_observation(id=observation_id)
        updated_model = latest_model.with_updated_observations(observations=new_observations)

        self.model_repo.update_model(project_id=project_id, model=updated_model, updated_at=updated_at, updated_by=updated_by)

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
