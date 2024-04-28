import dataclasses
from typing import List

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName

from morpheus.project.domain.events.ProjectEventName import ProjectEventName
from morpheus.project.types.Model import Model, ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.ModelVersion import ModelVersion, VersionId, VersionDescription
from morpheus.project.types.discretization import TimeDiscretization
from morpheus.project.types.discretization.spatial import Grid, ActiveCells
from morpheus.project.types.geometry import Polygon
from morpheus.project.types.layers.Layer import Layer, LayerId, LayerDescription, LayerName, LayerPropertyName, LayerPropertyDefaultValue, \
    LayerPropertyRaster, LayerPropertyZones, LayerConfinement


class ModelAffectedCellsUpdatedEvent(EventBase):
    @classmethod
    def from_affected_cells(cls, project_id: ProjectId, affected_cells: ActiveCells, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'affected_cells': affected_cells.to_dict()
            }
        )

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_AFFECTED_CELLS_UPDATED.to_str())


class ModelAffectedCellsRecalculatedEvent(EventBase):
    @classmethod
    def from_affected_cells(cls, project_id: ProjectId, affected_cells: ActiveCells, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'affected_cells': affected_cells.to_dict()
            }
        )

    def get_affected_cells(self) -> ActiveCells:
        return ActiveCells.from_dict(self.payload['affected_cells'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_AFFECTED_CELLS_RECALCULATED.to_str())


@dataclasses.dataclass(frozen=True)
class ModelCreatedEvent(EventBase):
    @classmethod
    def from_model(cls, project_id: ProjectId, model: Model, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload=model.to_dict(),
        )

    def get_model(self) -> Model:
        return Model.from_dict(obj=self.payload)

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_CREATED.to_str())


class ModelGeometryUpdatedEvent(EventBase):
    @classmethod
    def from_geometry(cls, project_id: ProjectId, polygon: Polygon, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'geometry': polygon.to_dict()
            }
        )

    def get_geometry(self) -> Polygon:
        return Polygon.from_dict(self.payload['geometry'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_GEOMETRY_UPDATED.to_str())


class ModelGridRecalculatedEvent(EventBase):
    @classmethod
    def from_grid(cls, project_id: ProjectId, grid: Grid, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'grid': grid.to_dict()
            }
        )

    def get_grid(self) -> Grid:
        return Grid.from_dict(self.payload['grid'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_GRID_RECALCULATED.to_str())


class ModelGridUpdatedEvent(EventBase):
    @classmethod
    def from_grid(cls, project_id: ProjectId, grid: Grid, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'grid': grid.to_dict()
            }
        )

    def get_grid(self) -> Grid:
        return Grid.from_dict(self.payload['grid'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_GRID_UPDATED.to_str())


class ModelTimeDiscretizationUpdatedEvent(EventBase):
    @classmethod
    def from_time_discretization(cls, project_id: ProjectId, time_discretization: TimeDiscretization, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'time_discretization': time_discretization.to_dict()
            }
        )

    def get_time_discretization(self) -> TimeDiscretization:
        return TimeDiscretization.from_dict(self.payload['time_discretization'])

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_TIME_DISCRETIZATION_UPDATED.to_str())


class ModelLayerClonedEvent(EventBase):
    @classmethod
    def from_layer_id(cls, project_id: ProjectId, model_id: ModelId, layer_id: LayerId, new_layer_id: LayerId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'layer_id': layer_id.to_str(),
                'new_layer_id': new_layer_id.to_str()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_layer_id(self) -> LayerId:
        return LayerId.from_str(self.payload['layer_id'])

    def get_new_layer_id(self) -> LayerId:
        return LayerId.from_str(self.payload['new_layer_id'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_LAYER_CLONED.to_str())


class ModelLayerConfinementUpdatedEvent(EventBase):
    @classmethod
    def from_confinement(cls, project_id: ProjectId, model_id: ModelId, layer_id: LayerId, confinement: LayerConfinement, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'layer_id': layer_id.to_str(),
                'confinement': confinement.to_value()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_layer_id(self) -> LayerId:
        return LayerId.from_str(self.payload['layer_id'])

    def get_confinement(self) -> LayerConfinement:
        return LayerConfinement.from_value(self.payload['confinement'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_LAYER_CONFINEMENT_UPDATED.to_str())


class ModelLayerCreatedEvent(EventBase):
    @classmethod
    def from_layer(cls, project_id: ProjectId, model_id: ModelId, layer: Layer, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'layer': layer.to_dict()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_layer(self) -> Layer:
        return Layer.from_dict(self.payload['layer'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_LAYER_CREATED.to_str())


class ModelLayerDeletedEvent(EventBase):
    @classmethod
    def from_layer_id(cls, project_id: ProjectId, model_id: ModelId, layer_id: LayerId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'layer_id': layer_id.to_str()
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_layer_id(self) -> LayerId:
        return LayerId.from_str(self.payload['layer_id'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_LAYER_DELETED.to_str())


class ModelLayerMetadataUpdatedEvent(EventBase):
    @classmethod
    def from_props(cls, project_id: ProjectId, model_id: ModelId, layer_id: LayerId, layer_name: LayerName | None, layer_description: LayerDescription | None,
                   occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'layer_id': layer_id.to_str(),
                'layer_name': layer_name.to_str() if layer_name else None,
                'layer_description': layer_description.to_str() if layer_description else None,
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_layer_id(self) -> LayerId:
        return LayerId.from_str(self.payload['layer_id'])

    def get_layer_name(self) -> LayerName | None:
        return LayerName.from_str(self.payload['layer_name'])

    def get_layer_description(self) -> LayerDescription | None:
        return LayerDescription.from_str(self.payload['layer_description'])

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_LAYER_METADATA_UPDATED.to_str())


class ModelLayerOrderUpdatedEvent(EventBase):
    @classmethod
    def from_layer_ids(cls, project_id: ProjectId, model_id: ModelId, layer_ids: List[LayerId], occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'order': [layer_id.to_str() for layer_id in layer_ids]
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_order(self) -> List[LayerId]:
        return [LayerId.from_str(layer_id) for layer_id in self.payload['order']]

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_LAYER_ORDER_UPDATED.to_str())


class ModelLayerPropertyUpdatedEvent(EventBase):
    @classmethod
    def for_property(cls, project_id: ProjectId, model_id: ModelId, layer_id: LayerId, property_name: LayerPropertyName, property_default_value: LayerPropertyDefaultValue,
                     occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'layer_id': layer_id.to_str(),
                'property_name': property_name.to_value(),
                'property_default_value': property_default_value.to_value(),
            }
        )

    def with_updated_raster(self, raster: LayerPropertyRaster | None):
        return ModelLayerPropertyUpdatedEvent(
            entity_uuid=self.entity_uuid,
            occurred_at=self.occurred_at,
            payload={
                **self.payload,
                'property_raster': raster.to_dict() if raster else None
            }
        )

    def with_updated_zones(self, zones: LayerPropertyZones | None):
        return ModelLayerPropertyUpdatedEvent(
            entity_uuid=self.entity_uuid,
            occurred_at=self.occurred_at,
            payload={
                **self.payload,
                'property_zones': zones.to_list() if zones else None
            }
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_model_id(self) -> ModelId:
        return ModelId.from_str(self.payload['model_id'])

    def get_layer_id(self) -> LayerId:
        return LayerId.from_str(self.payload['layer_id'])

    def get_property_name(self) -> LayerPropertyName:
        return LayerPropertyName.from_value(self.payload['property_name'])

    def get_property_default_value(self) -> LayerPropertyDefaultValue:
        return LayerPropertyDefaultValue.from_value(self.payload['property_default_value'])

    def has_property_raster(self) -> bool:
        return 'property_raster' in self.payload

    def get_property_raster(self) -> LayerPropertyRaster | None:
        return LayerPropertyRaster.from_dict(self.payload['property_raster']) if self.payload['property_raster'] else None

    def has_property_zones(self) -> bool:
        return 'property_zones' in self.payload

    def get_property_zones(self) -> LayerPropertyZones | None:
        return LayerPropertyZones.from_list(self.payload['property_zones']) if self.payload['property_zones'] else None

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.MODEL_LAYER_PROPERTY_UPDATED.to_str())


class VersionCreatedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload=version.to_dict(),
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VERSION_CREATED.to_str())

    def get_version(self) -> ModelVersion:
        return ModelVersion.from_dict(self.payload)


class VersionAssignedToModelEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VERSION_ASSIGNED_TO_MODEL.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])


class VersionDeletedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VERSION_DELETED.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])


class VersionDescriptionUpdatedEvent(EventBase):

    @classmethod
    def from_version(cls, project_id: ProjectId, version: ModelVersion, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version.version_id.to_str(), 'description': version.description.to_str()},
        )

    @classmethod
    def from_version_id(cls, project_id: ProjectId, version_id: VersionId, description: VersionDescription, occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={'version_id': version_id.to_str(), 'description': description.to_str()},
        )

    def get_project_id(self) -> ProjectId:
        return ProjectId.from_str(self.entity_uuid.to_str())

    def get_event_name(self) -> EventName:
        return EventName.from_str(ProjectEventName.VERSION_DESCRIPTION_UPDATED.to_str())

    def get_version_id(self) -> VersionId:
        return VersionId.from_str(self.payload['version_id'])

    def get_description(self) -> VersionDescription:
        return VersionDescription.from_str(self.payload['description'])
