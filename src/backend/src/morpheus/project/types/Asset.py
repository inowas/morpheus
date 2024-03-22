import dataclasses
from enum import StrEnum
from morpheus.common.types.File import File
from morpheus.common.types import Uuid
from morpheus.project.types.Project import ProjectId


class AssetId(Uuid):
    pass


class AssetType(StrEnum):
    IMAGE = 'image'
    GEO_TIFF = 'geo_tiff'
    SHAPEFILE = 'shapefile'


class Metadata:
    def to_dict(self):
        raise NotImplementedError

    @classmethod
    def from_dict(cls, obj: dict):
        raise NotImplementedError

    @classmethod
    def from_dict_and_type(cls, obj: dict, asset_type: AssetType):
        if asset_type == AssetType.IMAGE:
            return ImageMetadata.from_dict(obj)
        elif asset_type == AssetType.GEO_TIFF:
            return GeoTiffMetadata.from_dict(obj)
        elif asset_type == AssetType.SHAPEFILE:
            return ShapefileMetadata.from_dict(obj)
        else:
            raise ValueError(f'Invalid asset type: {asset_type}')


@dataclasses.dataclass(frozen=True)
class ImageMetadata(Metadata):
    width: int
    height: int

    def to_dict(self):
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            width=obj['width'],
            height=obj['height'],
        )


@dataclasses.dataclass(frozen=True)
class GeoTiffMetadata(Metadata):
    band_count: int

    def to_dict(self):
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            band_count=obj['band_count'],
        )


@dataclasses.dataclass(frozen=True)
class ShapefileMetadata(Metadata):
    type: str

    def to_dict(self):
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            type=obj['type'],
        )


@dataclasses.dataclass(frozen=True)
class Asset:
    id: AssetId
    project_id: ProjectId
    type: AssetType
    file: File
    metadata: Metadata

    def to_dict(self):
        return {
            'id': self.id.to_str(),
            'project_id': self.project_id.to_str(),
            'type': self.type.value,
            'file': self.file.to_dict(),
            'metadata': self.metadata.to_dict(),
        }

    @classmethod
    def from_dict(cls, obj: dict):
        asset_type = AssetType(obj['type'])

        return cls(
            id=AssetId.from_str(obj['id']),
            project_id=ProjectId.from_str(obj['project_id']),
            type=asset_type,
            file=File.from_dict(obj['file']),
            metadata=Metadata.from_dict_and_type(obj['metadata'], asset_type),
        )
