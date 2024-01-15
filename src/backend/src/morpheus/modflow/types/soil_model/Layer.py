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
    type: Literal['confined', 'convertible', 'unconfined']

    def __eq__(self, other):
        return self.type == other.type

    def __init__(self, layer_type: str | Literal['confined', 'convertible', 'unconfined']):
        if layer_type not in ['confined', 'convertible', 'unconfined']:
            raise ValueError('Layer type must be either confined, convertible or unconfined')
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
    def convertible(cls):
        return cls.from_str('convertible')

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
    specific_storage: float | list[list[float]]
    specific_yield: float | list[list[float]]
    initial_head: float | list[list[float]]
    top: float | list[list[float]] | None
    bottom: float | list[list[float]]

    def with_updated_kx(self, kx: float | list[list[float]]):
        return dataclasses.replace(self, kx=kx)

    def with_updated_ky(self, ky: float | list[list[float]]):
        return dataclasses.replace(self, ky=ky)

    def with_updated_kz(self, kz: float | list[list[float]]):
        return dataclasses.replace(self, kz=kz)

    def with_updated_specific_storage(self, specific_storage: float | list[list[float]]):
        return dataclasses.replace(self, specific_storage=specific_storage)

    def with_updated_specific_yield(self, specific_yield: float | list[list[float]]):
        return dataclasses.replace(self, specific_yield=specific_yield)

    def with_updated_initial_head(self, initial_head: float | list[list[float]]):
        return dataclasses.replace(self, initial_head=initial_head)

    def with_updated_top(self, top: float | list[list[float]]):
        return dataclasses.replace(self, top=top)

    def with_updated_bottom(self, bottom: float | list[list[float]]):
        return dataclasses.replace(self, bottom=bottom)

    def get_hk(self):
        return self.kx

    def get_vka(self):
        return self.kz

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

        # determine shape
        shape = None

        if isinstance(top, list):
            shape = shape if shape is not None else np.array(top).shape

        if isinstance(hk, list):
            shape = shape if shape is not None else np.array(hk).shape

        if isinstance(botm, list):
            shape = shape if shape is not None else np.array(botm).shape

        if shape is None:
            raise ValueError('Could not determine shape of top, hk and botm')

        # convert to numpy arrays
        hk_np_array = isinstance(hk, list) and np.array(hk, dtype=np.float32) or np.full(shape, hk, dtype=np.float32)
        botm_np_array = isinstance(botm, list) and np.array(botm, dtype=np.float32) or np.full(shape, botm,
                                                                                               dtype=np.float32)
        top_np_array = isinstance(top, list) and np.array(top, dtype=np.float32) or np.full(shape, top,
                                                                                            dtype=np.float32)

        if (not isinstance(top_np_array, np.ndarray) or
            not isinstance(hk_np_array, np.ndarray) or
            not isinstance(botm_np_array, np.ndarray)
        ):
            raise ValueError('Could not convert top, hk and botm to numpy arrays')

        return (hk_np_array * (top_np_array - botm_np_array)).tolist()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            kx=obj['kx'],
            ky=obj['ky'],
            kz=obj['kz'],
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
        return self.type == LayerType.confined()
