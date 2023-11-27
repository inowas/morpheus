import dataclasses
import Boundary
from .ConstantHead import ConstantHead


@dataclasses.dataclass
class BoundaryFactory:
    @staticmethod
    def create_from_dict(obj) -> Boundary:
        boundary_type = Boundary.BoundaryType.from_str(obj['type'])

        if boundary_type == Boundary.BoundaryType.constant_head():
            return ConstantHead.from_dict(obj)

        raise ValueError(f'Invalid boundary type: {boundary_type.type}')

    def to_dict(self):
        raise NotImplementedError()
