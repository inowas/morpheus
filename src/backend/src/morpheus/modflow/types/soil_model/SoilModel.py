import dataclasses

from .Layer import Layer, LayerId


@dataclasses.dataclass(frozen=True)
class SoilModel:
    layers: list[Layer]

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
        return self.layers[0].data.top

    def bottom(self):
        return self.layers[-1].data.bottom

    def initial_heads(self):
        return [layer.data.initial_head for layer in self.layers]

    def bottoms(self):
        return [layer.data.bottom for layer in self.layers]
