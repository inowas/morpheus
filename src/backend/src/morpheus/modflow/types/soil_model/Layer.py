import dataclasses
import uuid
from typing import Literal

import numpy as np


@dataclasses.dataclass(frozen=True)
class LayerId:
    value: str

    def __eq__(self, other: 'LayerId'):
        return self.value == other.value

    @classmethod
    def new(cls):
        return cls(value=str(uuid.uuid4()))

    @classmethod
    def from_str(cls, value: str):
        return cls(value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass
class LayerName:
    value: str

    @classmethod
    def new(cls):
        return cls(value='Default')

    @classmethod
    def from_str(cls, value: str):
        return cls(value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass
class LayerDescription:
    value: str

    @classmethod
    def new(cls):
        return cls(value='Default')

    @classmethod
    def from_str(cls, value: str):
        return cls(value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()


@dataclasses.dataclass
class LayerType:
    type: Literal['confined', 'unconfined']

    def __init__(self, layer_type: str | Literal['confined', 'unconfined']):
        if layer_type not in ['confined', 'unconfined']:
            raise ValueError('Layer type must be either confined or unconfined')
        self.type = layer_type

    @classmethod
    def from_str(cls, value: str):
        return cls(layer_type=value)

    @classmethod
    def from_value(cls, value: str):
        return cls.from_str(value)

    @classmethod
    def confined(cls):
        return cls.from_str('confined')

    @classmethod
    def unconfined(cls):
        return cls.from_str('unconfined')

    def to_value(self):
        return self.type


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

    def get_hkl(self):
        return self.kx

    def get_horizontal_anisotropy(self):
        return self.ky / self.kx

    def get_vertical_anisotropy(self):
        return self.kz / self.kx

    def is_wetting_active(self):
        return False

    def get_layer_average(self):
        return 0

    def get_transmissivity(self, top: float | list[list[float]]) -> float | list[list[float]]:
        hk = self.kx
        botm = self.bottom

        if isinstance(hk, float) and isinstance(botm, float) and isinstance(top, float):
            return hk * (top - botm)

        shape = None
        if isinstance(top, list):
            top = np.array(top)
            shape = top.shape

        if isinstance(hk, list):
            hk = np.array(hk)
            if shape is None:
                shape = hk.shape

        if isinstance(botm, list):
            botm = np.array(botm)
            shape = botm.shape

        if shape is None:
            raise ValueError('Could not determine shape of top, hk and botm')

        if isinstance(top, float):
            top = np.full(shape, top)

        if isinstance(hk, float):
            hk = np.full(shape, hk)

        if isinstance(botm, float):
            botm = np.full(shape, botm)

        return (hk * (top - botm)).tolist()

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
    id: LayerId
    name: LayerName
    description: LayerDescription
    type: LayerType
    data: LayerData

    @classmethod
    def from_default(cls):
        return cls(
            id=LayerId.new(),
            name=LayerName.new(),
            description=LayerDescription.new(),
            type=LayerType.confined(),
            data=LayerData(
                kx=1,
                ky=1,
                kz=1,
                porosity=0.1,
                specific_storage=0.0001,
                specific_yield=0.1,
                initial_head=1.0,
                top=1,
                bottom=0
            )
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            id=LayerId.from_value(obj['id']),
            name=LayerName.from_value(obj['name']),
            description=LayerDescription.from_value(obj['description']),
            type=LayerType.from_value(obj['type']),
            data=LayerData.from_dict(obj['data'])
        )

    def to_dict(self):
        return {
            'id': self.id.to_value(),
            'name': self.name.to_value(),
            'description': self.description.to_value(),
            'type': self.type.to_value(),
            'data': self.data.to_dict()
        }

    def is_confined(self):
        return self.type.to_value() == 'confined'
