import {IAsset, IAssetData, IAssetId, IAssetRasterData, IError} from '../types';
import {useApi} from '../incoming';
import {GeoJSON} from 'geojson';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setAssets, updateAsset, setLoading, removeAsset, setError} from '../infrastructure/assetsStore';
import {useEffect} from 'react';

interface IUseAssets {
  assets: IAsset[];
  uploadAsset: (file: File, description: string | undefined) => Promise<IAssetId | undefined>;
  fetchAssets: () => Promise<IAsset[] | undefined>;
  fetchAssetData: (assetId: IAssetId) => Promise<IAssetData | undefined>;
  fetchAssetMetadata: (assetId: IAssetId) => Promise<IAsset | undefined>;
  deleteAsset: (assetId: IAssetId) => Promise<IAssetId | undefined>;
  processRasterFile: (rasterFile: File) => Promise<IAssetRasterData>;
  processShapefile: (zipFile: File) => Promise<GeoJSON>;
  loading: boolean;
  error?: IError;
}

interface IGetAssetsResponse {
  assets: IAsset[];
}

const useAssets = (projectId: string): IUseAssets => {

  const {assets, loading, error} = useSelector((state: IRootState) => state.project.assets);
  const dispatch = useDispatch();
  const {httpDelete, httpGet, httpPost} = useApi();

  const deleteAsset = async (assetId: IAssetId): Promise<IAssetId | undefined> => {

    dispatch(setLoading(true));
    dispatch(setError(null));

    const deleteResponse = await httpDelete(`/projects/${projectId}/assets/${assetId}`);

    dispatch(setLoading(false));

    if (deleteResponse.ok) {
      dispatch(removeAsset(assetId));
      return assetId;
    }

    if (deleteResponse.err) {
      dispatch(setError(deleteResponse.val));
    }
  };

  const fetchAssets = async (): Promise<undefined> => {

    dispatch(setLoading(true));
    dispatch(setError(null));

    const getResponse = await httpGet<IGetAssetsResponse>(`/projects/${projectId}/assets`);

    dispatch(setLoading(false));

    if (getResponse.ok) {
      dispatch(setAssets(getResponse.val.assets));
    }

    if (getResponse.err) {
      dispatch(setError(getResponse.val));
    }
  };

  const fetchAssetMetadata = async (assetId: IAssetId): Promise<IAsset | undefined> => {

    const asset = assets.find(({asset_id}) => asset_id === assetId);
    if (asset) {
      return asset;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    const getResponse = await httpGet<IAsset>(`/projects/${projectId}/assets/${assetId}`);

    dispatch(setLoading(false));

    if (getResponse.ok) {
      dispatch(updateAsset(getResponse.val));
      return getResponse.val;
    }

    if (getResponse.err) {
      setError(getResponse.val);
    }
  };

  const fetchAssetData = async (assetId: IAssetId): Promise<IAssetData | undefined> => {

    dispatch(setLoading(true));
    dispatch(setError(null));

    const getResponse = await httpGet<IAssetData>(`/projects/${projectId}/assets/${assetId}/data`);

    dispatch(setLoading(false));

    if (getResponse.ok) {
      return getResponse.val;
    }

    if (getResponse.err) {
      dispatch(setError(getResponse.val));
    }
  };

  const uploadAsset = async (file: File, description: string | undefined): Promise<IAssetId | undefined> => {

    dispatch(setLoading(true));
    dispatch(setError(null));

    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const postResponse = await httpPost<FormData>(`/projects/${projectId}/assets`, formData);

    dispatch(setLoading(false));

    if (postResponse.ok) {
      await fetchAssets();
      return postResponse.val.location?.split('/').pop();
    }

    if (postResponse.err) {
      dispatch(setError(postResponse.val));
    }
  };

  const processShapefile = async (zipFile: File): Promise<GeoJSON> => {
    // upload shape file to server
    // when successfully uploaded, get shape file metadata from server
    // load shapefile data from server as geojson and show in a modal
    // select polygon geometry in the model and return it as model geometry
    // put this logic in a child component
    const assetId = await uploadAsset(zipFile, 'shapefile');

    if (!assetId) {
      return Promise.reject('Failed to upload shapefile.');
    }

    const geojson = await fetchAssetData(assetId) as unknown as GeoJSON | undefined;
    if (!geojson) {
      return Promise.reject('Failed to fetch shape file data.');
    }

    return Promise.resolve(geojson);
  };

  const processRasterFile = async (rasterFile: File): Promise<IAssetRasterData> => {
    const assetId = await uploadAsset(rasterFile, 'rasterfile');

    if (!assetId) {
      return Promise.reject('Failed to upload raster file.');
    }

    const data = await fetchAssetData(assetId);
    if (!data || 'geo_tiff' !== data.type) {
      return Promise.reject('Failed to fetch shapefile data.');
    }

    return Promise.resolve(data as IAssetRasterData);
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line
  }, []);

  return {
    assets,
    deleteAsset,
    fetchAssets,
    fetchAssetData,
    fetchAssetMetadata,
    processRasterFile,
    processShapefile,
    uploadAsset,
    loading,
    error: error ? error : undefined,
  };
};

export default useAssets;
export type {IUseAssets};
