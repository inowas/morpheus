import {FeatureCollection, GeoJSON} from 'geojson';

interface IRasterAsset {
  asset_id: IAssetId;
  project_id: string;
  type: 'geo_tiff';
  file: IFile;
  metadata: IGeoTiffMetadata;
}

interface IShapefileAsset {
  asset_id: IAssetId;
  project_id: string;
  type: 'shapefile';
  file: IFile;
  metadata: IShapefileMetadata;
}

type IAsset = IRasterAsset | IShapefileAsset;

type IAssetId = string;

type IAssetType = 'image' | 'geo_tiff' | 'shapefile';

interface IFile {
  file_name: string;
  size_in_bytes: number;
  mime_type: string;
}

type IAssetMetadata = IImageMetadata | IGeoTiffMetadata | IShapefileMetadata;

interface IImageMetadata {
  width: number;
  height: number;
}

interface IGeoTiffMetadata {
  n_cols: number;
  n_rows: number;
  n_bands: number;
  wgs_84_bounding_box: {
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
  }
}

interface IShapefileMetadata {
  number_of_features: number;
  geometry_type: 'Point' | 'LineString' | 'Polygon';
  wgs_84_bounding_box: {
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
  }
}

type IAssetData = IAssetRasterData | IAssetShapefileData;

interface IAssetRasterData {
  type: IAssetType;
  data: number[][];
  wgs_84_bounding_box: {
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
  },
  n_cols: number;
  n_rows: number;
  band: number;
}

interface IAssetShapefileData {
  type: IAssetType;
  data: FeatureCollection;
  wgs_84_bounding_box: {
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
  }
}

export type {IAsset, IAssetId, IAssetData, IRasterAsset, IShapefileAsset, IAssetRasterData, IAssetShapefileData, IAssetType, IFile, IAssetMetadata, IImageMetadata, IGeoTiffMetadata, IShapefileMetadata};
