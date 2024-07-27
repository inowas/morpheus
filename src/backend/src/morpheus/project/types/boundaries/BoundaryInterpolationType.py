from enum import StrEnum


class InterpolationType(StrEnum):
    none = 'none'
    forward_fill = 'forward_fill'
    linear = 'linear'
    nearest = 'nearest'
    default = forward_fill

    def __str__(self):
        return self.value
