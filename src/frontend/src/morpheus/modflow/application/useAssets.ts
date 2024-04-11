import {IError} from '../types';
import {useRef, useState} from 'react';
import {useApi} from '../incoming';

interface IUseFileUpload {
  uploadAsset: (file: File, description: string | undefined) => Promise<IAssetId | undefined>;
  fetchAssetData: (assetId: IAssetId) => Promise<object | [] | undefined>;
  fetchAssetMetadata: (assetId: string) => Promise<IAsset | undefined>;
  loading: boolean;
  error?: IError;
}

interface IAsset {
  asset_id: IAssetId;
  project_id: string;
  type: IAssetType;
  file: IFile;
  metadata: IAssetMetadata;
}

export type IAssetId = string;

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


const useAssets = (projectId: string): IUseFileUpload => {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);
  const {httpGet, httpPost} = useApi();

  const fetchAssetMetadata = async (assetId: IAssetId): Promise<IAsset | undefined> => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const getResponse = await httpGet<IAsset>(`/projects/${projectId}/assets/${assetId}`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (getResponse.ok) {
      return getResponse.val;
    }

    if (getResponse.err) {
      setError(getResponse.val);
    }
  }

  const fetchAssetData = async (assetId: IAssetId): Promise<object | [] | undefined> => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const getResponse = await httpGet<object>(`/projects/${projectId}/assets/${assetId}/data`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (getResponse.ok) {
      return getResponse.val;
    }

    if (getResponse.err) {
      setError(getResponse.val);
    }
  }

  const uploadAsset = async (file: File, description: string | undefined): Promise<IAssetId | undefined> => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const postResponse = await httpPost<FormData>(`/projects/${projectId}/assets`, formData);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (postResponse.ok) {
      return postResponse.val.location?.split('/').pop();
    }

    if (postResponse.err) {
      setError(postResponse.val);
    }
  };


  return {
    fetchAssetData,
    fetchAssetMetadata,
    uploadAsset,
    loading,
    error: error ? error : undefined,
  };
};

export default useAssets;
export type {IUseFileUpload};
