import dataclasses
import uuid
from enum import StrEnum
from typing import Literal, Mapping

import numpy as np

from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import Polygon
from morpheus.project.types.geometry.MultiPolygon import MultiPolygon


@dataclasses.dataclass(frozen=True)
class LayerId:
    value: str

    def __eq__(self, other):
        if not isinstance(other, LayerId):
            return False

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

    def __init__(self, layer_type: Literal['confined', 'convertible', 'unconfined']):
        if layer_type not in ['confined', 'convertible', 'unconfined']:
            raise ValueError('Layer type must be either confined, convertible or unconfined')
        self.type = layer_type

    @classmethod
    def from_str(cls, value: Literal['confined', 'convertible', 'unconfined']):
        return cls(layer_type=value)

    @classmethod
    def from_value(cls, value: Literal['confined', 'convertible', 'unconfined']):
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
class LayerPropertyRasterReference:
    asset_id: str
    asset_type: str
    band: int

    def to_dict(self):
        return {
            'asset_id': self.asset_id,
            'asset_type': self.asset_type,
            'band': self.band
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            asset_id=obj['asset_id'],
            asset_type=obj['asset_type'],
            band=obj['band']
        )


@dataclasses.dataclass
class LayerPropertyRaster:
    data: list[list[float]] | None
    reference: LayerPropertyRasterReference | None

    def __init__(self, data: list[list[float]] | None = None, reference: LayerPropertyRasterReference | None = None):
        self.data = data
        self.reference = reference

    def to_dict(self):
        return {
            'data': self.data,
            'reference': self.reference.to_dict() if self.reference is not None else None
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            data=obj['data'] if 'data' in obj and obj['data'] is not None else None,
            reference=LayerPropertyRasterReference.from_dict(obj['reference']) if 'reference' in obj and obj['reference'] is not None else None
        )


@dataclasses.dataclass
class LayerPropertyZone:
    affected_cells: ActiveCells
    geometry: Polygon | MultiPolygon
    value: float

    def __init__(self, affected_cells: ActiveCells, geometry: Polygon | MultiPolygon, value: float):
        self.affected_cells = affected_cells
        self.geometry = geometry
        self.value = value

    def to_dict(self):
        return {
            'affected_cells': self.affected_cells.to_dict(),
            'geometry': self.geometry.to_dict(),
            'value': self.value
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            affected_cells=ActiveCells.from_dict(obj['affected_cells']),
            geometry=Polygon.from_dict(obj['geometry']) if obj['geometry']['type'] == 'Polygon' else MultiPolygon.from_dict(obj['geometry']),
            value=obj['value']
        )


@dataclasses.dataclass
class LayerPropertyValue:
    value: float
    raster: LayerPropertyRaster | None
    zones: list[LayerPropertyZone] | None

    def __init__(self, value: float, raster: LayerPropertyRaster | None = None, zones: list[LayerPropertyZone] | None = None):
        self.value = value
        self.raster = raster
        self.zones = zones

    @classmethod
    def from_dict(cls, obj: dict | Mapping):
        return cls(
            value=obj['value'],
            raster=LayerPropertyRaster.from_dict(obj['raster']) if 'raster' and obj['raster'] is not None else None,
            zones=[LayerPropertyZone.from_dict(zone) for zone in obj['zones']] if 'zones' in obj and obj['zones'] is not None else None
        )

    def to_dict(self):
        return {
            'value': self.value,
            'raster': self.raster.to_dict() if self.raster is not None else None,
            'zones': [zone.to_dict() for zone in self.zones] if self.zones is not None else None
        }

    def get_data(self) -> float | list[list[float]]:
        if self.raster is not None and self.raster.data is not None:
            return self.raster.data

        if self.zones is not None and len(self.zones) > 0:
            shape = self.zones[0].affected_cells.shape
            data = np.ones(shape) * self.value
            for zone in self.zones:
                zone_data = np.ones(shape) * zone.value * zone.affected_cells.to_mask()
                data = np.where(zone.affected_cells.to_mask(), zone_data, data)
            return data.tolist()

        return self.value


class LayerPropertyName(StrEnum):
    kx = 'kx'
    ky = 'ky'
    kz = 'kz'
    specific_storage = 'specific_storage'
    specific_yield = 'specific_yield'
    initial_head = 'initial_head'
    top = 'top'
    bottom = 'bottom'


@dataclasses.dataclass
class LayerProperties:
    kx: LayerPropertyValue
    ky: LayerPropertyValue
    kz: LayerPropertyValue
    specific_storage: LayerPropertyValue
    specific_yield: LayerPropertyValue
    initial_head: LayerPropertyValue
    top: LayerPropertyValue | None
    bottom: LayerPropertyValue

    def with_updated_property(self, name: LayerPropertyName, value: LayerPropertyValue):
        if name == LayerPropertyName.kx:
            return self.with_updated_kx(value)
        if name == LayerPropertyName.ky:
            return self.with_updated_ky(value)
        if name == LayerPropertyName.kz:
            return self.with_updated_kz(value)
        if name == LayerPropertyName.specific_storage:
            return self.with_updated_specific_storage(value)
        if name == LayerPropertyName.specific_yield:
            return self.with_updated_specific_yield(value)
        if name == LayerPropertyName.initial_head:
            return self.with_updated_initial_head(value)
        if name == LayerPropertyName.top:
            return self.with_updated_top(value)
        if name == LayerPropertyName.bottom:
            return self.with_updated_bottom(value)
        raise ValueError(f'Unknown property name: {name}')

    def with_updated_hk(self, hk: LayerPropertyValue):
        return self.with_updated_kx(hk)

    def with_updated_hani(self, hani: LayerPropertyValue):
        return self.with_updated_ky(hani)

    def with_updated_kx(self, kx: LayerPropertyValue):
        return dataclasses.replace(self, kx=kx)

    def with_updated_ky(self, ky: LayerPropertyValue):
        return dataclasses.replace(self, ky=ky)

    def with_updated_kz(self, kz: LayerPropertyValue):
        return dataclasses.replace(self, kz=kz)

    def with_updated_specific_storage(self, specific_storage: LayerPropertyValue):
        return dataclasses.replace(self, specific_storage=specific_storage)

    def with_updated_specific_yield(self, specific_yield: LayerPropertyValue):
        return dataclasses.replace(self, specific_yield=specific_yield)

    def with_updated_initial_head(self, initial_head: LayerPropertyValue):
        return dataclasses.replace(self, initial_head=initial_head)

    def with_updated_top(self, top: LayerPropertyValue):
        return dataclasses.replace(self, top=top)

    def with_updated_bottom(self, bottom: LayerPropertyValue):
        return dataclasses.replace(self, bottom=bottom)

    def get_hk(self):
        return self.kx

    def get_vka(self):
        return self.kz

    def get_horizontal_anisotropy(self):
        return (np.array(self.ky.get_data()) / np.array(self.kx.value)).tolist()

    def get_vertical_anisotropy(self):
        return (np.array(self.kz.get_data()) / np.array(self.kx.get_data())).tolist()

    def is_wetting_active(self):
        return False

    def get_layer_average(self):
        return 0

    def get_transmissivity(self, top: LayerPropertyValue) -> LayerPropertyValue:
        return (np.array(self.kx.get_data()) * (np.array(top.get_data()) - np.array(self.bottom.get_data()))).tolist()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            kx=LayerPropertyValue.from_dict(obj['kx']),
            ky=LayerPropertyValue.from_dict(obj['ky']),
            kz=LayerPropertyValue.from_dict(obj['kz']),
            specific_storage=LayerPropertyValue.from_dict(obj['specific_storage']),
            specific_yield=LayerPropertyValue.from_dict(obj['specific_yield']),
            initial_head=LayerPropertyValue.from_dict(obj['initial_head']),
            top=LayerPropertyValue.from_dict(obj['top']) if obj['top'] is not None else None,
            bottom=LayerPropertyValue.from_dict(obj['bottom'])
        )

    @classmethod
    def from_values(cls, kx: float, ky: float, kz: float, specific_storage: float, specific_yield: float, initial_head: float, top: float | None, bottom: float):
        return cls(
            kx=LayerPropertyValue(value=kx),
            ky=LayerPropertyValue(value=ky),
            kz=LayerPropertyValue(value=kz),
            specific_storage=LayerPropertyValue(value=specific_storage),
            specific_yield=LayerPropertyValue(value=specific_yield),
            initial_head=LayerPropertyValue(value=initial_head),
            top=LayerPropertyValue(value=top) if top is not None else None,
            bottom=LayerPropertyValue(value=bottom)
        )

    def to_dict(self):
        return {
            'kx': self.kx.to_dict(),
            'ky': self.ky.to_dict(),
            'kz': self.kz.to_dict(),
            'specific_storage': self.specific_storage.to_dict(),
            'specific_yield': self.specific_yield.to_dict(),
            'initial_head': self.initial_head.to_dict(),
            'top': self.top.to_dict() if self.top is not None else None,
            'bottom': self.bottom.to_dict()
        }


@dataclasses.dataclass
class Layer:
    id: LayerId
    name: LayerName
    description: LayerDescription
    type: LayerType
    properties: LayerProperties

    @classmethod
    def from_default(cls):
        return cls(
            id=LayerId.new(),
            name=LayerName.new(),
            description=LayerDescription.new(),
            type=LayerType.confined(),
            properties=LayerProperties(
                kx=LayerPropertyValue(value=1.0),
                ky=LayerPropertyValue(value=1.0),
                kz=LayerPropertyValue(value=1.0),
                specific_storage=LayerPropertyValue(value=0.0001),
                specific_yield=LayerPropertyValue(value=0.1),
                initial_head=LayerPropertyValue(value=1.0),
                top=LayerPropertyValue(value=1.0),
                bottom=LayerPropertyValue(value=0.0)
            )
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            id=LayerId.from_value(obj['id']),
            name=LayerName.from_value(obj['name']),
            description=LayerDescription.from_value(obj['description']),
            type=LayerType.from_value(obj['type']),
            properties=LayerProperties.from_dict(obj['properties'])
        )

    def to_dict(self):
        return {
            'id': self.id.to_value(),
            'name': self.name.to_value(),
            'description': self.description.to_value(),
            'type': self.type.to_value(),
            'properties': self.properties.to_dict()
        }

    def is_confined(self):
        return self.type == LayerType.confined()
