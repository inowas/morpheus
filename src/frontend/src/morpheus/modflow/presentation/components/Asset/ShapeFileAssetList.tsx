import React, {useState} from 'react';
import {IAsset, IAssetData, IAssetShapefileData} from '../../../types';
import {List, Search, SearchProps, Segment} from 'semantic-ui-react';
import {Form, Grid, ShapeFileInput} from 'common/components';
import styles from './Asset.module.less';
import {Polygon} from 'geojson';
import {Map} from 'common/components/Map';
import ShapeFileAssetDataLayer from './ShapeFileAssetDataLayer';

interface IProps {
  assets: IAsset[];
  selectedAsset: IAsset | null;
  assetData: IAssetData | null;
  onChangeSelectedAsset: (asset: IAsset) => void;
  onFileUpload: (file: File) => void;
  loading: boolean;
  isReadOnly: boolean;
  modelDomain?: Polygon;
}


const ShapeFileAssetList = ({assets, assetData, selectedAsset, onChangeSelectedAsset, onFileUpload, loading, isReadOnly, modelDomain}: IProps) => {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.MouseEvent<HTMLElement>, data: SearchProps) => {
    const {value} = data;
    setSearchQuery(value as string);
  };

  const filteredAssets = assets.filter(asset =>
    asset.file.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const isAssetShapefileData = (data: IAssetData): data is IAssetShapefileData => (data && 'shapefile' === data.type);

  return (
    <Grid.Grid>
      <Grid.Column width={6}>
        <div className={styles.assetListHeader}>
          <ShapeFileInput
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
          {assetData && isAssetShapefileData(assetData) &&
            <Map>
              <ShapeFileAssetDataLayer data={assetData} modelDomain={modelDomain}/>
            </Map>
          }
        </Segment>
      </Grid.Column>
    </Grid.Grid>
  );
};

export default ShapeFileAssetList;
