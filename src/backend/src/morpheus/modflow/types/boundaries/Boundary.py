import dataclasses
from typing import Literal

from morpheus.common.types import Uuid


class BoundaryId(Uuid):
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


@dataclasses.dataclass
class Boundary:
    id: BoundaryId
    type: BoundaryType
    enabled: bool = True

    @classmethod
    def from_dict(cls, obj):
        raise NotImplementedError()

    def to_dict(self):
        raise NotImplementedError()


@dataclasses.dataclass(frozen=True)
class ObservationId:
    value: str

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
