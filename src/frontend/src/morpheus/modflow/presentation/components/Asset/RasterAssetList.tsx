import React, {useEffect, useState} from 'react';
import {IAsset, IAssetData, IAssetRasterData} from '../../../types';
import {Header, List, Search, SearchProps, Segment} from 'semantic-ui-react';
import {GeoTiffAssetData} from './index';
import {Form, Grid, RasterFileInput} from 'common/components';
import styles from './Asset.module.less';

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

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.MouseEvent<HTMLElement>, data: SearchProps) => {
    const {value} = data;
    setSearchQuery(value as string);
  };

  const filteredAssets = assets.filter(asset =>
    asset.file.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
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
    <Grid.Grid>
      <Grid.Column width={6}>
        <div className={styles.assetListHeader}>
          <RasterFileInput
            icon={'upload'}
            readOnly={isReadOnly}
            onSubmit={onFileUpload}
          />
          <Search
            icon={false}
            onSearchChange={handleSearchChange}
            value={searchQuery}
            placeholder={'Search assets...'}
            className={styles.search}
          />
        </div>
        <List className={styles.assetListList}>
          {filteredAssets.map((asset) => (
            <List.Item
              key={asset.asset_id}
              onClick={() => onChangeSelectedAsset(asset)}
            >
              <Form.Radio
                checked={selectedAsset?.asset_id === asset.asset_id}
                disabled={isReadOnly}
              />
              <List.Header>{asset.file.file_name}</List.Header>
              {selectedAsset?.asset_id === asset.asset_id ? <List.Icon name='file'/> : <List.Icon name='file outline'/>}
            </List.Item>))}
        </List>
      </Grid.Column>
      <Grid.Column width={10}>
        <Segment loading={loading} style={{height: '100%', border: 'none', boxShadow: 'none', padding: 0}}>
          <Header as={'h4'}>Asset details</Header>
          <p>Asset ID: {selectedAsset?.asset_id}</p>
          {assetData && isAssetGeoTiffData(assetData) && <GeoTiffAssetData data={assetData}/>}
        </Segment>
      </Grid.Column>
    </Grid.Grid>
  );
};

export default RasterAssetList;
