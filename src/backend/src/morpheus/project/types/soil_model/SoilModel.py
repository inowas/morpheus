import dataclasses
from typing import Iterator

from .Layer import Layer, LayerId


@dataclasses.dataclass(frozen=True)
class SoilModel:
    layers: list[Layer]

    def __iter__(self) -> Iterator[Layer]:
        return iter(self.layers)

    @classmethod
    def new(cls):
        return cls(layers=[Layer.from_default()])

    @classmethod
    def from_dict(cls, collection: list):
        return cls(layers=[Layer.from_dict(layer) for layer in collection])

    def to_dict(self):
        return [layer.to_dict() for layer in self.layers]

    def get_layer(self, layer_id: LayerId):
        return next((layer for layer in self.layers if layer.id == layer_id), None)

    def with_added_layer(self, layer: Layer):
        return SoilModel(layers=self.layers + [layer])

    def with_updated_layer(self, updated_layer: Layer):
        return SoilModel(layers=[updated_layer if updated_layer.id == layer.id else layer for layer in self.layers])

    def with_deleted_layer(self, layer_id: str):
        return SoilModel(layers=[layer for layer in self.layers if layer.id != layer_id])

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
        return [layer.id for layer in self.layers]
