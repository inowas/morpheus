from enum import StrEnum


class InterpolationType(StrEnum):
    none = 'none'
    nearest = 'nearest'
    linear = 'linear'
    forward_fill = 'forward_fill'
