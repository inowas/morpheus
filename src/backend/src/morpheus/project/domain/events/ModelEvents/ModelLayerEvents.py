from typing import List

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventName import EventName
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.layers.Layer import Layer, LayerId, LayerDescription, LayerName, LayerPropertyName, \
    LayerPropertyDefaultValue, LayerPropertyRaster, LayerPropertyZones, LayerConfinement

from .EventNames import ModelLayerEventName


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

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelLayerEventName.MODEL_LAYER_CLONED.to_str())


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

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelLayerEventName.MODEL_LAYER_CONFINEMENT_UPDATED.to_str())


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

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelLayerEventName.MODEL_LAYER_CREATED.to_str())


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

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelLayerEventName.MODEL_LAYER_DELETED.to_str())


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

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelLayerEventName.MODEL_LAYER_METADATA_UPDATED.to_str())


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

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelLayerEventName.MODEL_LAYER_ORDER_UPDATED.to_str())


class ModelLayerPropertyUpdatedEvent(EventBase):
    @classmethod
    def from_default_value(cls, project_id: ProjectId, model_id: ModelId, layer_id: LayerId, property_name: LayerPropertyName, property_default_value: LayerPropertyDefaultValue,
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

    @classmethod
    def from_raster(cls, project_id: ProjectId, model_id: ModelId, layer_id: LayerId, property_name: LayerPropertyName, property_raster: LayerPropertyRaster | None,
                    occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'layer_id': layer_id.to_str(),
                'property_name': property_name.to_value(),
                'property_raster': property_raster.to_dict() if property_raster else None
            }
        )

    @classmethod
    def from_zones(cls, project_id: ProjectId, model_id: ModelId, layer_id: LayerId, property_name: LayerPropertyName, property_zones: LayerPropertyZones | None,
                   occurred_at: DateTime):
        return cls(
            entity_uuid=Uuid.from_str(project_id.to_str()),
            occurred_at=occurred_at,
            payload={
                'model_id': model_id.to_str(),
                'layer_id': layer_id.to_str(),
                'property_name': property_name.to_value(),
                'property_zones': property_zones.to_list() if property_zones else None
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

    def has_property_default_value(self) -> bool:
        return 'property_default_value' in self.payload

    def get_property_default_value(self) -> LayerPropertyDefaultValue | None:
        return LayerPropertyDefaultValue.from_value(self.payload['property_default_value']) if 'property_default_value' in self.payload else None

    def has_property_raster(self) -> bool:
        return 'property_raster' in self.payload

    def get_property_raster(self) -> LayerPropertyRaster | None:
        return LayerPropertyRaster.from_dict(self.payload['property_raster']) if 'property_raster' in self.payload and self.payload['property_raster'] else None

    def has_property_zones(self) -> bool:
        return 'property_zones' in self.payload

    def get_property_zones(self) -> LayerPropertyZones | None:
        return LayerPropertyZones.from_list(self.payload['property_zones']) if 'property_zones' in self.payload and self.payload['property_zones'] else None

    @staticmethod
    def get_event_name() -> EventName:
        return EventName.from_str(ModelLayerEventName.MODEL_LAYER_PROPERTY_UPDATED.to_str())
