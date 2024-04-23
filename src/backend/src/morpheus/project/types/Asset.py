import dataclasses
from enum import StrEnum
from typing import Literal, Sequence

from morpheus.common.types.File import File, FileName
from morpheus.common.types import Uuid, String
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.geometry.BoundingBox import BoundingBox


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
    n_cols: int
    n_rows: int
    n_bands: int
    wgs_84_bounding_box: BoundingBox

    def to_dict(self):
        return {
            'n_cols': self.n_cols,
            'n_rows': self.n_rows,
            'n_bands': self.n_bands,
            'wgs_84_bounding_box': self.wgs_84_bounding_box.to_dict(),
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            n_cols=obj['n_cols'],
            n_rows=obj['n_rows'],
            n_bands=obj['n_bands'],
            wgs_84_bounding_box=BoundingBox.from_dict(obj['wgs_84_bounding_box']),
        )


@dataclasses.dataclass(frozen=True)
class ShapefileMetadata(Metadata):
    geometry_type: Literal['Polygon'] | Literal['LineString'] | Literal['Point']
    n_geometries: int
    wgs_84_bounding_box: BoundingBox

    def to_dict(self):
        return {
            'geometry_type': self.geometry_type,
            'n_geometries': self.n_geometries,
            'wgs_84_bounding_box': self.wgs_84_bounding_box.to_dict(),
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            geometry_type=obj['geometry_type'],
            n_geometries=obj['n_geometries'],
            wgs_84_bounding_box=BoundingBox.from_dict(obj['wgs_84_bounding_box']),
        )


class AssetDescription(String):
    pass


@dataclasses.dataclass(frozen=True)
class Asset:
    asset_id: AssetId
    project_id: ProjectId
    type: AssetType
    file: File
    metadata: Metadata
    description: AssetDescription | None = None

    def to_dict(self):
        return {
            'asset_id': self.asset_id.to_str(),
            'project_id': self.project_id.to_str(),
            'type': self.type.value,
            'file': self.file.to_dict(),
            'metadata': self.metadata.to_dict(),
            'description': self.description.to_str() if self.description is not None else None,
        }

    @classmethod
    def from_dict(cls, obj: dict):
        asset_type = AssetType(obj['type'])

        return cls(
            asset_id=AssetId.from_str(obj['asset_id']),
            project_id=ProjectId.from_str(obj['project_id']),
            type=asset_type,
            file=File.from_dict(obj['file']),
            metadata=Metadata.from_dict_and_type(obj['metadata'], asset_type),
            description=AssetDescription.try_from_str(obj['description']),
        )


@dataclasses.dataclass(frozen=True)
class AssetFilter:
    project_id: ProjectId | None = None
    asset_type: list[AssetType] | None = None
    file_name: FileName | None = None
    description: AssetDescription | None = None


class AssetData:
    def to_dict(self):
        raise NotImplementedError


@dataclasses.dataclass(frozen=True)
class GeoTiffAssetData(AssetData):
    n_cols: int
    n_rows: int
    band: int
    wgs_84_bounding_box: BoundingBox
    data: Sequence[Sequence[float | None]]

    def to_dict(self):
        return {
            'n_cols': self.n_cols,
            'n_rows': self.n_rows,
            'band': self.band,
            'wgs_84_bounding_box': self.wgs_84_bounding_box.to_dict(),
            'data': self.data
        }


@dataclasses.dataclass(frozen=True)
class ShapefileAssetData(AssetData):
    data: dict

    def to_dict(self):
        return self.data
