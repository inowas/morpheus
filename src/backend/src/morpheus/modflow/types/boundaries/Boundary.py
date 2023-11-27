import dataclasses
from typing import Literal

from morpheus.common.types import Uuid, String


class BoundaryId(Uuid):
    pass


class ObservationId(Uuid):
    pass


@dataclasses.dataclass(frozen=True)
class BoundaryType:
    type: Literal['constant_head', 'drain', 'general_head', 'recharge', 'river', 'well']

    def __eq__(self, other):
        return self.type == other.type

    @classmethod
    def from_str(cls, value: Literal['constant_head', 'drain', 'general_head', 'recharge', 'river', 'well']):
        return cls(type=value)

    @classmethod
    def constant_head(cls):
        return cls.from_str('constant_head')

    @classmethod
    def drain(cls):
        return cls.from_str('drain')

    @classmethod
    def general_head(cls):
        return cls.from_str('general_head')

    @classmethod
    def recharge(cls):
        return cls.from_str('recharge')

    @classmethod
    def river(cls):
        return cls.from_str('river')

    @classmethod
    def well(cls):
        return cls.from_str('well')

    def to_value(self):
        return self.type


class BoundaryName(String):
    pass


@dataclasses.dataclass
class Boundary:
    id: BoundaryId
    type: BoundaryType
    name: BoundaryName
    enabled: bool

    def __init__(self, id: BoundaryId, type: BoundaryType, boundary_name: BoundaryName, enabled: bool = True):
        self.id = id
        self.type = type
        self.name = boundary_name
        self.enabled = enabled

    @classmethod
    def from_dict(cls, obj):
        raise NotImplementedError()

    def to_dict(self):
        raise NotImplementedError()


@dataclasses.dataclass
class BoundaryCollection:
    boundaries: list[Boundary]

    @classmethod
    def new(cls):
        return cls(boundaries=[])

    @classmethod
    def from_list(cls, collection: list[Boundary]):
        return cls(boundaries=collection)

    def to_list(self):
        return [boundary.to_dict() for boundary in self.boundaries]

    def get_boundaries_of_type(self, boundary_type: BoundaryType):
        return [boundary for boundary in self.boundaries if boundary.type == boundary_type]
