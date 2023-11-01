import dataclasses
import uuid
from typing import Literal


@dataclasses.dataclass
class LayerData:
    kx: float | list[list[float]]
    ky: float | list[list[float]]
    kz: float | list[list[float]]
    porosity: float | list[list[float]]
    specific_storage: float | list[list[float]]
    specific_yield: float | list[list[float]]
    initial_head: float | list[list[float]]
    top: float | list[list[float]] | None
    bottom: float | list[list[float]]

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            kx=obj['kx'],
            ky=obj['ky'],
            kz=obj['kz'],
            porosity=obj['porosity'],
            specific_storage=obj['specific_storage'],
            specific_yield=obj['specific_yield'],
            initial_head=obj['initial_head'],
            top=obj['top'],
            bottom=obj['bottom']
        )

    def to_dict(self):
        return {
            'kx': self.kx,
            'ky': self.ky,
            'kz': self.kz,
            'porosity': self.porosity,
            'specific_storage': self.specific_storage,
            'specific_yield': self.specific_yield,
            'initial_head': self.initial_head,
            'top': self.top,
            'bottom': self.bottom
        }


@dataclasses.dataclass
class Layer:
    id: str
    name: str
    description: str
    type: Literal['confined', 'unconfined']
    data: LayerData

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            id=obj['id'],
            name=obj['name'],
            description=obj['description'],
            type=obj['type'],
            data=LayerData.from_dict(obj['data'])
        )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.type,
            'data': self.data.to_dict()
        }


@dataclasses.dataclass
class LayerCollection:
    layers: list[Layer]

    @classmethod
    def from_default(cls):
        return cls(layers=[
            Layer(
                id=str(uuid.uuid4()),
                name='Default',
                description='Default layer',
                type='confined',
                data=LayerData(
                    kx=1,
                    ky=1,
                    kz=1,
                    porosity=0.1,
                    specific_storage=0.0001,
                    specific_yield=0.1,
                    initial_head=1,
                    top=1,
                    bottom=0
                )
            )
        ])

    @classmethod
    def from_list(cls, collection: list):
        return cls(layers=[Layer.from_dict(layer) for layer in collection])

    def to_list(self):
        return [layer.to_dict() for layer in self.layers]
