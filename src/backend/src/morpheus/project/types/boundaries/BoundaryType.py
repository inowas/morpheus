from enum import StrEnum
from typing import Literal

BoundaryTypeLiteral = Literal['constant_head', 'drain', 'evapotranspiration', 'flow_and_head', 'general_head', 'lake', 'recharge', 'river', 'well']


class BoundaryType(StrEnum):
    constant_head = 'constant_head'
    drain = 'drain'
    evapotranspiration = 'evapotranspiration'
    flow_and_head = 'flow_and_head'
    general_head = 'general_head'
    lake = 'lake'
    recharge = 'recharge'
    river = 'river'
    well = 'well'

    @classmethod
    def from_value(cls, value: BoundaryTypeLiteral):
        return BoundaryType(value)

    @classmethod
    def from_str(cls, value: str):
        return BoundaryType(value)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.value
