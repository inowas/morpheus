import dataclasses
import uuid
from enum import StrEnum
from typing import Literal, Mapping

import numpy as np

from morpheus.common.types import Float, Uuid, String
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
class LayerConfinement:
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

    def to_str(self):
        return self.type


@dataclasses.dataclass
class LayerPropertyRasterReference:
    asset_id: str
    band: int

    def __eq__(self, other):
        if not isinstance(other, LayerPropertyRasterReference):
            return False

        return self.asset_id == other.asset_id and self.band == other.band

    def to_dict(self):
        return {
            'asset_id': self.asset_id,
            'band': self.band,
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            asset_id=obj['asset_id'],
            band=obj['band'],
        )

    @classmethod
    def from_payload(cls, obj):
        return cls(
            asset_id=obj['asset_id'],
            band=obj['band'],
        )


@dataclasses.dataclass
class LayerPropertyRasterData:
    data: list[list[float]]
    nodata_value: float | int

    def __eq__(self, other):
        if not isinstance(other, LayerPropertyRasterData):
            return False

        return self.data == other.data and self.nodata_value == other.nodata_value

    def __getitem__(self, item):
        return self.data[item]

    def __iter__(self):
        return iter(self.data)

    def __len__(self):
        return len(self.data)

    def to_dict(self):
        return {
            'data': self.data,
            'nodata_value': self.nodata_value
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            data=obj['data'],
            nodata_value=obj['nodata_value']
        )


class LayerPropertyDefaultValue(Float):
    pass


@dataclasses.dataclass
class LayerPropertyRaster:
    data: LayerPropertyRasterData
    reference: LayerPropertyRasterReference | None

    def __init__(self, data: LayerPropertyRasterData, reference: LayerPropertyRasterReference | None = None):
        self.data = data
        self.reference = reference

    def __eq__(self, other):
        if not isinstance(other, LayerPropertyRaster):
            return False

        return self.data == other.data and self.reference == other.reference

    def to_dict(self):
        return {
            'data': self.data.to_dict(),
            'reference': self.reference.to_dict() if self.reference is not None else None
        }

    @classmethod
    def from_dict(cls, obj):
        return cls(
            data=LayerPropertyRasterData.from_dict(obj['data']),
            reference=LayerPropertyRasterReference.from_dict(obj['reference']) if 'reference' in obj and obj['reference'] is not None else None
        )

    @classmethod
    def from_data(cls, data: list[list[float]], nodata_value: float | int = -9999):
        return cls(data=LayerPropertyRasterData(data=data, nodata_value=nodata_value))


class ZoneId(Uuid):
    pass


class ZoneName(String):
    pass


@dataclasses.dataclass
class LayerPropertyZone:
    zone_id: ZoneId
    name: ZoneName
    affected_cells: ActiveCells
    geometry: Polygon | MultiPolygon
    value: float

    def __init__(self, zone_id: ZoneId, name: ZoneName, affected_cells: ActiveCells, geometry: Polygon | MultiPolygon, value: float):
        self.zone_id = zone_id
        self.name = name
        self.affected_cells = affected_cells
        self.geometry = geometry
        self.value = value

    def __eq__(self, other):
        if not isinstance(other, LayerPropertyZone):
            return False

        return self.affected_cells == other.affected_cells and self.geometry == other.geometry and self.value == other.value and self.name == other.name

    def to_dict(self):
        return {
            'zone_id': self.zone_id.to_str(),
            'name': self.name.to_str(),
            'affected_cells': self.affected_cells.to_dict(),
            'geometry': self.geometry.to_dict(),
            'value': self.value
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            zone_id=ZoneId.from_str(obj['zone_id']),
            name=ZoneName.from_str(obj['name']),
            affected_cells=ActiveCells.from_dict(obj['affected_cells']) if obj['affected_cells'] is not None else ActiveCells.empty_from_shape(1, 1),
            geometry=Polygon.from_dict(obj['geometry']) if obj['geometry']['type'] == 'Polygon' else MultiPolygon.from_dict(obj['geometry']),
            value=obj['value']
        )


@dataclasses.dataclass
class LayerPropertyZones:
    zones: list[LayerPropertyZone]

    @classmethod
    def empty(cls):
        return cls(zones=[])

    def __eq__(self, other):
        if not isinstance(other, LayerPropertyZones):
            return False

        return self.to_list() == other.to_list()

    def __init__(self, zones: list[LayerPropertyZone]):
        self.zones = zones

    def __getitem__(self, item):
        return self.zones[item]

    def __iter__(self):
        return iter(self.zones)

    def __len__(self):
        return len(self.zones)

    def to_list(self):
        self.zones.sort(key=lambda zone: zone.zone_id.to_str())
        return [zone.to_dict() for zone in self.zones]

    @classmethod
    def from_list(cls, obj):
        return cls([LayerPropertyZone.from_dict(zone) for zone in obj])


@dataclasses.dataclass
class LayerPropertyValues:
    value: LayerPropertyDefaultValue
    raster: LayerPropertyRaster | None
    zones: LayerPropertyZones | None

    def __init__(self, value: LayerPropertyDefaultValue, raster: LayerPropertyRaster | None = None, zones: LayerPropertyZones | None = None):
        self.value = value
        self.raster = raster
        self.zones = zones

    @classmethod
    def from_dict(cls, obj: dict | Mapping):
        return cls(
            value=LayerPropertyDefaultValue.from_float(obj['value']),
            raster=LayerPropertyRaster.from_dict(obj['raster']) if 'raster' and obj['raster'] is not None else None,
            zones=LayerPropertyZones.from_list(obj['zones']) if 'zones' and obj['zones'] is not None else None
        )

    @classmethod
    def from_value(cls, value: float):
        return cls(value=LayerPropertyDefaultValue(value))

    def to_dict(self):
        return {
            'value': self.value.to_float(),
            'raster': self.raster.to_dict() if self.raster is not None else None,
            'zones': [zone.to_dict() for zone in self.zones] if self.zones is not None else None
        }

    def get_shape(self) -> tuple[int, ...] | None:
        if self.raster is not None and self.raster.data is not None:
            return np.array(self.raster.data).shape
        if self.zones is not None:
            return self.zones[0].affected_cells.shape
        return None

    def get_data(self) -> float | list[list[float]]:
        # if only the default value is set, return it
        if self.raster is None and self.zones is None:
            return self.value.to_float()

        # get the shape of the area
        shape = self.get_shape()
        if shape is None:
            return self.value.to_float()

        np_raster_data = np.ones(shape) * self.value.to_float()
        if self.raster is not None and self.raster.data is not None:
            np_raster_data = np.array(self.raster.data)
            np_raster_data = np.where(np_raster_data == self.raster.data.nodata_value, self.value.to_float(), np_raster_data)

        if self.zones is not None and len(self.zones) > 0:
            for zone in self.zones:
                zone_data = np.ones(shape) * zone.value * zone.affected_cells.data
                np_raster_data = np.where(zone.affected_cells.data, zone_data, np_raster_data)

        return np_raster_data.tolist()


class LayerPropertyName(StrEnum):
    hk = 'hk'
    hani = 'hani'
    vka = 'vka'
    specific_storage = 'specific_storage'
    specific_yield = 'specific_yield'
    initial_head = 'initial_head'
    top = 'top'
    bottom = 'bottom'

    @classmethod
    def from_value(cls, value: str):
        return cls(value)

    @classmethod
    def from_str(cls, value: str):
        return cls(value)

    def to_value(self):
        return self.value

    def to_str(self):
        return self.value


@dataclasses.dataclass
class LayerProperties:
    hk: LayerPropertyValues
    hani: LayerPropertyValues
    vka: LayerPropertyValues

    specific_storage: LayerPropertyValues
    specific_yield: LayerPropertyValues
    initial_head: LayerPropertyValues
    top: LayerPropertyValues | None
    bottom: LayerPropertyValues

    def with_updated_property(self, property_name: LayerPropertyName, property_values: LayerPropertyValues):
        if property_name == LayerPropertyName.hk:
            return self.with_updated_hk(property_values)
        if property_name == LayerPropertyName.hani:
            return self.with_updated_hani(property_values)
        if property_name == LayerPropertyName.vka:
            return self.with_updated_vka(property_values)
        if property_name == LayerPropertyName.specific_storage:
            return self.with_updated_specific_storage(property_values)
        if property_name == LayerPropertyName.specific_yield:
            return self.with_updated_specific_yield(property_values)
        if property_name == LayerPropertyName.initial_head:
            return self.with_updated_initial_head(property_values)
        if property_name == LayerPropertyName.top:
            return self.with_updated_top(property_values)
        if property_name == LayerPropertyName.bottom:
            return self.with_updated_bottom(property_values)
        raise ValueError(f'Unknown property name: {property_name}')

    def with_updated_hk(self, hk: LayerPropertyValues):
        return dataclasses.replace(self, hk=hk)

    def with_updated_hani(self, hani: LayerPropertyValues):
        return dataclasses.replace(self, hani=hani)

    def with_updated_vka(self, vka: LayerPropertyValues):
        return dataclasses.replace(self, vka=vka)

    def with_updated_specific_storage(self, specific_storage: LayerPropertyValues):
        return dataclasses.replace(self, specific_storage=specific_storage)

    def with_updated_specific_yield(self, specific_yield: LayerPropertyValues):
        return dataclasses.replace(self, specific_yield=specific_yield)

    def with_updated_initial_head(self, initial_head: LayerPropertyValues):
        return dataclasses.replace(self, initial_head=initial_head)

    def with_updated_top(self, top: LayerPropertyValues):
        return dataclasses.replace(self, top=top)

    def with_updated_bottom(self, bottom: LayerPropertyValues):
        return dataclasses.replace(self, bottom=bottom)

    def get_property(self, property_name: LayerPropertyName) -> LayerPropertyValues | None:
        if property_name == LayerPropertyName.hk:
            return self.hk
        if property_name == LayerPropertyName.hani:
            return self.hani
        if property_name == LayerPropertyName.vka:
            return self.vka
        if property_name == LayerPropertyName.specific_storage:
            return self.specific_storage
        if property_name == LayerPropertyName.specific_yield:
            return self.specific_yield
        if property_name == LayerPropertyName.initial_head:
            return self.initial_head
        if property_name == LayerPropertyName.top:
            return self.top
        if property_name == LayerPropertyName.bottom:
            return self.bottom
        raise ValueError(f'Unknown property name: {property_name}')

    def get_hk(self):
        return self.hk

    def get_vka(self):
        return self.vka

    def get_horizontal_anisotropy(self):
        return self.hani.get_data()

    def get_vertical_anisotropy(self):
        hk = self.hk.get_data()
        vka = self.vka.get_data()
        return (np.array(vka) / np.array(hk)).tolist()

    def is_wetting_active(self):
        return False

    def get_layer_average(self):
        return 0

    def get_transmissivity(self, top: LayerPropertyValues) -> LayerPropertyValues:
        return (np.array(self.hk.get_data()) * (np.array(top.get_data()) - np.array(self.bottom.get_data()))).tolist()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            hk=LayerPropertyValues.from_dict(obj['hk']),
            hani=LayerPropertyValues.from_dict(obj['hani']),
            vka=LayerPropertyValues.from_dict(obj['vka']),
            specific_storage=LayerPropertyValues.from_dict(obj['specific_storage']),
            specific_yield=LayerPropertyValues.from_dict(obj['specific_yield']),
            initial_head=LayerPropertyValues.from_dict(obj['initial_head']),
            top=LayerPropertyValues.from_dict(obj['top']) if obj['top'] is not None else None,
            bottom=LayerPropertyValues.from_dict(obj['bottom'])
        )

    @classmethod
    def from_values(cls, hk: float, hani: float, vka: float, specific_storage: float, specific_yield: float, initial_head: float, top: float | None, bottom: float):
        return cls(
            hk=LayerPropertyValues.from_value(value=hk),
            hani=LayerPropertyValues.from_value(value=hani),
            vka=LayerPropertyValues.from_value(value=vka),
            specific_storage=LayerPropertyValues.from_value(value=specific_storage),
            specific_yield=LayerPropertyValues.from_value(value=specific_yield),
            initial_head=LayerPropertyValues.from_value(value=initial_head),
            top=LayerPropertyValues.from_value(value=top) if top is not None else None,
            bottom=LayerPropertyValues.from_value(value=bottom)
        )

    def to_dict(self):
        return {
            'hk': self.hk.to_dict(),
            'hani': self.hani.to_dict(),
            'vka': self.vka.to_dict(),
            'specific_storage': self.specific_storage.to_dict(),
            'specific_yield': self.specific_yield.to_dict(),
            'initial_head': self.initial_head.to_dict(),
            'top': self.top.to_dict() if self.top is not None else None,
            'bottom': self.bottom.to_dict()
        }


@dataclasses.dataclass
class Layer:
    layer_id: LayerId
    name: LayerName
    description: LayerDescription
    confinement: LayerConfinement
    properties: LayerProperties

    @classmethod
    def from_default(cls):
        return cls(
            layer_id=LayerId.new(),
            name=LayerName.new(),
            description=LayerDescription.new(),
            confinement=LayerConfinement.confined(),
            properties=LayerProperties.from_values(
                hk=1.0,
                hani=1.0,
                vka=1.0,
                specific_storage=0.0001,
                specific_yield=0.1,
                initial_head=1.0,
                top=1.0,
                bottom=0.0
            )
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            layer_id=LayerId.from_value(obj['layer_id']),
            name=LayerName.from_value(obj['name']),
            description=LayerDescription.from_value(obj['description']),
            confinement=LayerConfinement.from_value(obj['confinement']),
            properties=LayerProperties.from_dict(obj['properties'])
        )

    def to_dict(self):
        return {
            'layer_id': self.layer_id.to_value(),
            'name': self.name.to_value(),
            'description': self.description.to_value(),
            'confinement': self.confinement.to_value(),
            'properties': self.properties.to_dict()
        }

    def is_confined(self):
        return self.confinement == LayerConfinement.confined()

    def get_property_values(self, property_name: LayerPropertyName) -> LayerPropertyValues | None:
        return self.properties.get_property(property_name)

    def clone(self, layer_id: LayerId):
        return dataclasses.replace(self, layer_id=layer_id)

    def with_updated_name(self, layer_name: LayerName):
        return dataclasses.replace(self, name=layer_name)

    def with_updated_description(self, layer_description: LayerDescription):
        return dataclasses.replace(self, description=layer_description)

    def with_updated_confinement(self, confinement: LayerConfinement):
        return dataclasses.replace(self, confinement=confinement)

    def with_updated_property(self, property_name: LayerPropertyName, property_values: LayerPropertyValues):
        return dataclasses.replace(self, properties=self.properties.with_updated_property(property_name=property_name, property_values=property_values))
