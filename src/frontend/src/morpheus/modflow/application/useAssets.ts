import {IAsset, IAssetData, IAssetId, IAssetRasterData, IAssetShapefileData, IError} from '../types';
import {useApi} from '../incoming';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setAssets, updateAsset, removeAsset, setError, setLoadingList, setLoadingAsset, setLoadingData, setLoadingUpload} from '../infrastructure/assetsStore';
import {useEffect} from 'react';
import useProjectCommandBus from './useProjectCommandBus';
import {IDeleteAssetCommand, IUpdateAssetDescriptionCommand, IUpdateAssetFileNameCommand} from './useProjectCommandBus.type';
import JSZip from 'jszip';

interface IUseAssets {
  assets: IAsset[];
  shapeFiles: IAsset[];
  rasterFiles: IAsset[];
  uploadAsset: (file: File, description?: string) => Promise<IAssetId | undefined>;
  updateAssetDescription: (assetId: IAssetId, description: string) => Promise<void>;
  updateAssetFileName: (assetId: IAssetId, fileName: string) => Promise<void>;
  fetchAssets: () => Promise<IAsset[] | undefined>;
  fetchAssetData: (assetId: IAssetId) => Promise<IAssetData | undefined>;
  fetchAssetMetadata: (assetId: IAssetId) => Promise<IAsset | undefined>;
  deleteAsset: (assetId: IAssetId) => Promise<IAssetId | undefined>;
  processRasterFile: (rasterFile: File) => Promise<IAssetRasterData>;
  processShapefile: (files: File[]) => Promise<IAssetShapefileData>;
  uploadRasterFile: (file: File) => Promise<IAssetId | undefined>;
  uploadShapefile: (files: File[]) => Promise<IAssetId | undefined>;
  loadingAsset: false | IAssetId;
  loadingData: false | IAssetId;
  loadingList: boolean;
  uploadingAsset: boolean;
  error?: IError;
}

interface IGetAssetsResponse {
  assets: IAsset[];
}

const useAssets = (projectId: string): IUseAssets => {

  const {assets, loading, error} = useSelector((state: IRootState) => state.project.assets);
  const dispatch = useDispatch();
  const {httpGet, httpPost} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const fetchAssets = async (): Promise<undefined> => {

    dispatch(setLoadingList(true));
    dispatch(setError(null));

    const getResponse = await httpGet<IGetAssetsResponse>(`/projects/${projectId}/assets`);

    dispatch(setLoadingList(false));

    if (getResponse.ok) {
      dispatch(setAssets(getResponse.val.assets));
    }

    if (getResponse.err) {
      dispatch(setError(getResponse.val));
    }
  };

  const fetchAssetMetadata = async (assetId: IAssetId): Promise<IAsset | undefined> => {

    dispatch(setLoadingAsset(assetId));
    dispatch(setError(null));

    const getResponse = await httpGet<IAsset>(`/projects/${projectId}/assets/${assetId}`);

    dispatch(setLoadingAsset(false));

    if (getResponse.ok) {
      dispatch(updateAsset(getResponse.val));
      return getResponse.val;
    }

    if (getResponse.err) {
      setError(getResponse.val);
    }
  };

  const fetchAssetData = async (assetId: IAssetId): Promise<IAssetData | undefined> => {

    dispatch(setLoadingData(assetId));
    dispatch(setError(null));

    const getResponse = await httpGet<IAssetData>(`/projects/${projectId}/assets/${assetId}/data`);

    dispatch(setLoadingData(false));

    if (getResponse.ok) {
      return getResponse.val;
    }

    if (getResponse.err) {
      dispatch(setError(getResponse.val));
    }
  };

  const deleteAsset = async (assetId: IAssetId): Promise<IAssetId | undefined> => {

    dispatch(setLoadingAsset(assetId));
    dispatch(setError(null));

    const deleteAssetCommand: IDeleteAssetCommand = {
      command_name: 'delete_asset_command',
      payload: {
        project_id: projectId,
        asset_id: assetId,
      },
    };

    const deleteResponse = await sendCommand(deleteAssetCommand);

    dispatch(setLoadingAsset(false));

    if (deleteResponse.ok) {
      dispatch(removeAsset(assetId));
      return assetId;
    }

    if (deleteResponse.err) {
      dispatch(setError(deleteResponse.val));
    }
  };

  const updateAssetDescription = async (assetId: IAssetId, description: string): Promise<void> => {

    dispatch(setLoadingAsset(assetId));
    dispatch(setError(null));

    const updateAssetFileNameCommand: IUpdateAssetDescriptionCommand = {
      command_name: 'update_asset_description_command',
      payload: {
        project_id: projectId,
        asset_id: assetId,
        asset_description: description,
      },
    };


    const updateResponse = await sendCommand(updateAssetFileNameCommand);

    dispatch(setLoadingAsset(false));

    if (updateResponse.ok) {
      fetchAssetMetadata(assetId);
    }

    if (updateResponse.err) {
      dispatch(setError(updateResponse.val));
    }
  };
  const updateAssetFileName = async (assetId: IAssetId, fileName: string): Promise<void> => {

    dispatch(setLoadingAsset(assetId));
    dispatch(setError(null));

    const updateAssetFileNameCommand: IUpdateAssetFileNameCommand = {
      command_name: 'update_asset_file_name_command',
      payload: {
        project_id: projectId,
        asset_id: assetId,
        asset_file_name: fileName,
      },
    };


    const updateResponse = await sendCommand(updateAssetFileNameCommand);

    dispatch(setLoadingAsset(false));

    console.log(updateResponse, updateResponse.ok);

    if (updateResponse.ok) {
      await fetchAssetMetadata(assetId);
    }

    if (updateResponse.err) {
      dispatch(setError(updateResponse.val));
    }
  };

  const uploadAsset = async (file: File, description?: string): Promise<IAssetId | undefined> => {

    dispatch(setLoadingUpload(true));
    dispatch(setError(null));

    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const postResponse = await httpPost<FormData>(`/projects/${projectId}/assets`, formData);

    dispatch(setLoadingUpload(false));

    if (postResponse.ok) {
      await fetchAssets();
      return postResponse.val.location?.split('/').pop();
    }

    if (postResponse.err) {
      dispatch(setError(postResponse.val));
    }
  };

  const uploadRasterFile = async (file: File): Promise<IAssetId | undefined> => {
    if (file.name.endsWith('.tif') || file.name.endsWith('.tiff') || file.name.endsWith('.geotiff')) {
      return uploadAsset(file, file.name);
    }
  };

  const uploadShapefile = async (files: File[]): Promise<IAssetId | undefined> => {

    // Check if the file is a zip file and return this file directly
    const zipFile = files.find((file) => file.name.endsWith('.zip'));
    if (zipFile) {
      uploadAsset(zipFile);
    }

    // if no zip file is found, compress the files and upload the zip file
    if (!zipFile) {
      const zip = new JSZip();
      const fileName = files.find((file) => file.name.endsWith('.shp'))?.name.split('.shp')[0] || 'shapefile';
      files.forEach((file) => zip.file(`${file.name}`, file));
      const zipContent = await zip.generateAsync({type: 'blob'});
      const file = new File([zipContent], `${fileName}.zip`, {type: 'application/zip'});
      return uploadAsset(file, fileName);
    }
  };

  const processShapefile = async (files: File[]): Promise<IAssetShapefileData> => {
    // upload shape file to server
    // return shapefile data from server as geojson
    const assetId = await uploadShapefile(files);

    if (!assetId) {
      return Promise.reject('Failed to upload shapefile.');
    }

    const shapeFileData = await fetchAssetData(assetId) as IAssetShapefileData | undefined;
    if (!shapeFileData) {
      return Promise.reject('Failed to fetch shape file data.');
    }

    return Promise.resolve(shapeFileData as IAssetShapefileData);
  };

  const processRasterFile = async (rasterFile: File): Promise<IAssetRasterData> => {
    // upload raster file to server
    // return raster file data from server
    const assetId = await uploadRasterFile(rasterFile);

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
    shapeFiles: assets.filter((asset) => 'shapefile' === asset.type),
    rasterFiles: assets.filter((asset) => 'geo_tiff' === asset.type),
    deleteAsset,
    fetchAssets,
    fetchAssetData,
    fetchAssetMetadata,
    processRasterFile,
    processShapefile,
    updateAssetDescription,
    updateAssetFileName,
    uploadAsset,
    uploadRasterFile,
    uploadShapefile,
    loadingAsset: loading.asset,
    loadingData: loading.data,
    loadingList: loading.list,
    uploadingAsset: loading.upload,
    error: error ? error : undefined,
  };
};

export default useAssets;
export type {IUseAssets, IAssetId};
