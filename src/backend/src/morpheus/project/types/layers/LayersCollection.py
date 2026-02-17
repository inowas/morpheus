import dataclasses
from typing import Iterator

from .Layer import Layer, LayerId


@dataclasses.dataclass(frozen=True)
class LayersCollection:
    layers: list[Layer]

    def __len__(self):
        return len(self.layers)

    def __iter__(self) -> Iterator[Layer]:
        return iter(self.layers)

    def __getitem__(self, item):
        return self.layers[item]

    @classmethod
    def new(cls):
        return cls(layers=[Layer.from_default()])

    @classmethod
    def from_dict(cls, collection: list):
        return cls(layers=[Layer.from_dict(layer) for layer in collection])

    def to_dict(self):
        return [layer.to_dict() for layer in self.layers]

    def get_layer(self, layer_id: LayerId):
        return next((layer for layer in self.layers if layer.layer_id == layer_id), None)

    def has_layer(self, layer_id: LayerId) -> bool:
        return any(layer.layer_id == layer_id for layer in self.layers)

    def with_added_layer(self, layer: Layer):
        return dataclasses.replace(self, layers=self.layers + [layer])

    def with_updated_layer(self, updated_layer: Layer):
        return dataclasses.replace(self, layers=[updated_layer if updated_layer.layer_id == layer.layer_id else layer for layer in self.layers])

    def assert_layer_can_be_deleted(self, layer_id: LayerId):
        if layer_id not in self.get_layer_ids():
            raise ValueError("Layer to be deleted does not exist in the collection")

        if len(self.layers) == 1:
            raise ValueError("Cannot delete the last layer")

    def assert_layer_can_be_added(self, layer: Layer):
        if layer.layer_id in self.get_layer_ids():
            raise ValueError("Layer to be added already exists in the collection")

    def assert_layer_can_be_cloned(self, layer_id: LayerId, new_layer_id: LayerId):
        if layer_id not in self.get_layer_ids():
            raise ValueError("Layer to be cloned does not exist in the collection")

        if new_layer_id in self.get_layer_ids():
            raise ValueError("New layer id already exists in the collection")

    def assert_order_can_be_updated(self, layer_ids: list[LayerId]):
        # check if all layer_ids are in the collection
        if not all(layer_id in self.get_layer_ids() for layer_id in layer_ids):
            raise ValueError("Not all layer_ids are part of the collection")

        if len(layer_ids) != len(set(layer_ids)):
            raise ValueError("Not all layer_ids are unique")

        # check if the number of layer_ids is the same as the number of layers
        if len(layer_ids) != len(self.layers):
            raise ValueError("Number of layer_ids does not match the number of layers")

    def with_updated_order(self, layer_ids: list[LayerId]):
        self.assert_order_can_be_updated(layer_ids)
        return dataclasses.replace(self, layers=[layer for layer_id in layer_ids for layer in self.layers if layer.layer_id == layer_id])

    def with_deleted_layer(self, layer_id: LayerId):
        self.assert_layer_can_be_deleted(layer_id)
        return dataclasses.replace(self, layers=[layer for layer in self.layers if layer.layer_id != layer_id])

    def number_of_layers(self):
        return len(self.layers)

    def top(self):
        top = self.layers[0].properties.top.get_data() if self.layers[0].properties.top else None
        if top is not None:
            return top

        raise ValueError("Top of first layer is not set")

    def bottom(self):
        return self.layers[-1].properties.bottom.get_data()

    def initial_heads(self):
        return [layer.properties.initial_head.get_data() for layer in self.layers]

    def bottoms(self):
        return [layer.properties.bottom.get_data() for layer in self.layers]

    def get_layer_ids(self) -> list[LayerId]:
        return [layer.layer_id for layer in self.layers]
