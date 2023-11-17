import dataclasses
import Boundary
from .ConstantHead import ConstantHead
from .Drain import Drain
from .GeneralHead import GeneralHead
from .Recharge import Recharge
from .River import River
from .Well import Well


@dataclasses.dataclass
class BoundaryFactory:
    @staticmethod
    def create_from_dict(obj) -> Boundary:
        boundary_type = Boundary.BoundaryType.from_str(obj['type'])

        if boundary_type == Boundary.BoundaryType.constant_head():
            return ConstantHead.from_dict(obj)

        if boundary_type == Boundary.BoundaryType.drain():
            return Drain.from_dict(obj)

        if boundary_type == Boundary.BoundaryType.general_head():
            return GeneralHead.from_dict(obj)

        if boundary_type == Boundary.BoundaryType.recharge():
            return Recharge.from_dict(obj)

        if boundary_type == Boundary.BoundaryType.river():
            return River.from_dict(obj)

        if boundary_type == Boundary.BoundaryType.well():
            return Well.from_dict(obj)

        raise ValueError(f'Invalid boundary type: {boundary_type.type}')

    def to_dict(self):
        raise NotImplementedError()
