import dataclasses
from enum import StrEnum

from morpheus.common.types.File import File
from morpheus.common.types import Uuid
from morpheus.project.types.Project import ProjectId


class AssetId(Uuid):
    pass


class AssetType(StrEnum):
    IMAGE = 'image'
    RASTERFILE = 'rasterfile'
    SHAPEFILE = 'shapefile'


@dataclasses.dataclass(frozen=True)
class Asset:
    id: AssetId
    project_id: ProjectId
    type: AssetType
    file: File

    def to_dict(self):
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            id=AssetId.from_str(obj['id']),
            project_id=ProjectId.from_str(obj['project_id']),
            type=AssetType(obj['type']),
            file=File.from_dict(obj['file']),
        )
