import React, {useEffect, useState} from 'react';
import {Modal} from 'common/components';
import useProjectPermissions from '../../application/useProjectPermissions';
import useAssets from '../../application/useAssets';
import {Button, Tab, TabPane} from 'semantic-ui-react';
import {useParams} from 'react-router-dom';
import {IAsset, IAssetData, IAssetId} from '../../types';
import RasterAssetList from '../components/Asset/RasterAssetList';
import ShapeFileAssetList from '../components/Asset/ShapeFileAssetList';
import {FeatureCollection} from 'geojson';

interface IProps {
  onSelectRasterFile?: (assetId: IAssetId) => void;
  onSelectShapefile?: (assetId: IAssetId, data: FeatureCollection) => void;
  onClose: () => void;
}

const AssetsModalContainer = ({onClose, onSelectRasterFile, onSelectShapefile}: IProps) => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {assets, loading, uploadAsset, fetchAssetData} = useAssets(projectId as string);
  const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null);

  const [rasterFiles, setRasterFiles] = useState<IAsset[]>([]);
  const [shapeFiles, setShapeFiles] = useState<IAsset[]>([]);

  const [assetData, setAssetData] = useState<IAssetData | null>(null);


  useEffect(() => {
    setRasterFiles(assets.filter((asset) => 'geo_tiff' === asset.type));
    setShapeFiles(assets.filter((asset) => 'shapefile' === asset.type));
  }, [assets]);

  useEffect(() => {
    if (selectedAsset) {
      return;
    }

    if (onSelectRasterFile && 0 < rasterFiles.length && !selectedAsset) {
      setSelectedAsset(rasterFiles[0]);
    }

    if (onSelectShapefile && 0 < shapeFiles.length) {
      setSelectedAsset(shapeFiles[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rasterFiles, shapeFiles]);

  useEffect(() => {
    if (selectedAsset) {
      fetchAssetData(selectedAsset.asset_id).then((data) => {
        if (data) {
          setAssetData(data);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset]);

  if (isReadOnly) {
    return null;
  }

  const handleFileUpload = async (file: File) => {
    const assetId = await uploadAsset(file, 'Raster File');
    const asset = assets.find((a) => a.asset_id === assetId);
    if (asset) {
      setSelectedAsset(asset);
    }
  };

  const getPanes = () => {
    const panes = [];
    if (onSelectRasterFile) {
      panes.push({
        menuItem: 'Raster files', render: () => (
          <TabPane>
            <RasterAssetList
              assets={rasterFiles} selectedAsset={selectedAsset}
              assetData={assetData} onChangeSelectedAsset={setSelectedAsset}
              loading={loading}
              isReadOnly={isReadOnly}
              onFileUpload={handleFileUpload}
            />
          </TabPane>
        ),
      });
    }
    if (onSelectShapefile) {
      panes.push({
        menuItem: 'Shape files', render: () => (
          <TabPane>
            <ShapeFileAssetList
              assets={shapeFiles} selectedAsset={selectedAsset}
              assetData={assetData} onChangeSelectedAsset={setSelectedAsset}
              loading={loading}
              isReadOnly={isReadOnly}
              onFileUpload={handleFileUpload}
            />
          </TabPane>
        ),
      });
    }
    return panes;
  };

  return (
    <Modal.Modal
      onClose={onClose}
      open={true}
      dimmer={'inverted'}
    >
      <Modal.Header>Assets</Modal.Header>
      <Modal.Content>
        <Tab
          panes={getPanes()}
          variant="primary"
          menu={{secondary: true, pointing: true}}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive={true}
          content={'Submit'}
          disabled={!selectedAsset}
          onClick={() => {
            if ('shapefile' == selectedAsset?.type && onSelectShapefile && assetData) {
              onSelectShapefile(selectedAsset.asset_id, assetData.data as FeatureCollection);
              onClose();
            }
            if ('geo_tiff' == selectedAsset?.type && onSelectRasterFile) {
              onSelectRasterFile(selectedAsset.asset_id);
              onClose();
            }
          }}
        />
        <Button content={'Close'} onClick={onClose}/>
      </Modal.Actions>
    </Modal.Modal>
  );
};


export default AssetsModalContainer;
