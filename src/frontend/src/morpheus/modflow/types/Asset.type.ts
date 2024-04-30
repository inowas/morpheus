interface IAsset {
  asset_id: IAssetId;
  project_id: string;
  type: IAssetType;
  file: IFile;
  metadata: IAssetMetadata;
}

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

export type {IAsset, IAssetId, IAssetType, IFile, IAssetMetadata, IImageMetadata, IGeoTiffMetadata, IShapefileMetadata};
