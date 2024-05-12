import React, {useEffect} from 'react';
import {IAsset, IAssetData, IAssetRasterData} from '../../../types';
import {Grid, GridColumn, Header, List, Search, Segment} from 'semantic-ui-react';
import {GeoTiffAssetData} from './index';
import {Divider, RasterFileInput} from 'common/components';

interface IProps {
  assets: IAsset[];
  selectedAsset: IAsset | null;
  assetData: IAssetData | null;
  onChangeSelectedAsset: (asset: IAsset) => void;
  onFileUpload: (file: File) => void;
  loading: boolean;
  isReadOnly: boolean;
}


const RasterAssetList = ({assets, assetData, selectedAsset, onChangeSelectedAsset, loading, onFileUpload, isReadOnly}: IProps) => {

  const isAssetGeoTiffData = (data: IAssetData): data is IAssetRasterData => (data && 'geo_tiff' === data.type);

  useEffect(() => {
    if ('geo_tiff' === selectedAsset?.type) {
      return;
    }

    if (0 < assets.length) {
      onChangeSelectedAsset(assets[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid divided={true}>
      <GridColumn width={4}>
        <RasterFileInput readOnly={isReadOnly} onSubmit={onFileUpload}/>
        <Divider/>
        <Search fluid={true} placeholder={'Search assets...'}/>
        <Divider/>
        <List divided={true} relaxed={true}>
          {assets.map((asset) => (
            <List.Item
              key={asset.asset_id}
              onClick={() => onChangeSelectedAsset(asset)}
              style={{cursor: 'pointer', backgroundColor: selectedAsset?.asset_id === asset.asset_id ? '#f9f9f9' : 'white'}}
            >
              {selectedAsset?.asset_id === asset.asset_id ? <List.Icon name='file'/> : <List.Icon name='file outline'/>}
              <List.Header>{asset.file.file_name}</List.Header>
              <List.Description>{asset.type}</List.Description>
            </List.Item>))}
        </List>

      </GridColumn>
      <GridColumn width={12}>
        <Segment loading={loading}>
          <Header as={'h2'}>Asset Details</Header>
          <p>Asset ID: {selectedAsset?.asset_id}</p>
          {assetData && isAssetGeoTiffData(assetData) && <GeoTiffAssetData data={assetData}/>}
        </Segment>
      </GridColumn>
    </Grid>
  );
};

export default RasterAssetList;
