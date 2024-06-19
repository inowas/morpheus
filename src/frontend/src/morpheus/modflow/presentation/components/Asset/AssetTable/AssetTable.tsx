import React, {useEffect, useState} from 'react';
import {Checkbox, Segment, Table} from 'semantic-ui-react';
import {Button, SortButtons} from 'common/components';
import styles from './AssetTable.module.less';

import {IAsset, IAssetId} from '../../../../types';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  fileType: string;
  assets: IAsset[];
  loading: boolean;
  deleteAsset: (id: string) => void;
  isReadOnly: boolean;
  selectedAsset: IAsset | null;
  onSelectAsset: (asset: IAsset) => void;
  onChangeCheckedAssets?: (assetId: IAssetId[] | null) => void;
}

interface ISortBy {
  name: 'file_name' | 'file_size';
  direction: 'asc' | 'desc';
}

const calculateFileSize = (size_in_bytes: number) => {
  if (1024 > size_in_bytes) {
    return `${size_in_bytes} B`;
  }
  if (size_in_bytes < 1024 * 1024) {
    return `${(size_in_bytes / 1024).toFixed(1)} KB`;
  }
  return `${(size_in_bytes / 1024 / 1024).toFixed(1)} MB`;
};

const AssetTable = ({
  style,
  className,
  fileType,
  assets,
  loading,
  deleteAsset,
  isReadOnly,
  selectedAsset,
  onSelectAsset,
  onChangeCheckedAssets,
}: IProps) => {

  const [checkedAssets, setCheckedAssets] = useState<string[]>([]);

  const [sortedAssets, setSortedAssets] = useState<IAsset[]>(assets);
  const [sortBy, setSortBy] = useState<ISortBy>({name: 'file_name', direction: 'asc'});

  useEffect(() => {
    if (onChangeCheckedAssets) {
      onChangeCheckedAssets(checkedAssets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedAssets]);

  const handleSort = (assetsToSort: IAsset[], sort: ISortBy) => (
    assetsToSort.toSorted((a, b) => {
      switch (sort.name) {
      case 'file_name':
        const fileNameCompareResult = a.file.file_name.localeCompare(b.file.file_name);
        return 'asc' === sort.direction ? fileNameCompareResult : -fileNameCompareResult;
      case 'file_size':
        const sizeCompareResult = a.file.size_in_bytes - b.file.size_in_bytes;
        return 'asc' === sort.direction ? sizeCompareResult : -sizeCompareResult;
      default :
        return 0;
      }
    }));

  useEffect(() => {
    const newSortedAssets = handleSort(assets, sortBy);
    setSortedAssets(newSortedAssets);
    if (0 === newSortedAssets.length) {
      return;
    }

    if (!selectedAsset || !newSortedAssets.find((asset) => asset.asset_id === selectedAsset.asset_id)) {
      onSelectAsset(newSortedAssets[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  const handleSelectAll = () => {
    if (checkedAssets.length === assets.length) {
      return setCheckedAssets([]);
    }
    return setCheckedAssets(assets.map((asset) => asset.asset_id));
  };

  const renderHeader = () => (
    <Table.Row>
      {onChangeCheckedAssets && <Table.HeaderCell><Checkbox checked={checkedAssets.length === assets.length} onClick={handleSelectAll}/></Table.HeaderCell>}
      <Table.HeaderCell>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          File name
          <SortButtons onClick={(direction) => setSortBy({name: 'file_name', direction})} direction={'file_name' === sortBy.name ? sortBy.direction : null}/>
        </div>
      </Table.HeaderCell>
      <Table.HeaderCell>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          File size
          <SortButtons onClick={(direction) => setSortBy({name: 'file_size', direction})} direction={'file_size' === sortBy.name ? sortBy.direction : null}/>
        </div>
      </Table.HeaderCell>
      {!isReadOnly && <Table.HeaderCell></Table.HeaderCell>}
    </Table.Row>
  );

  const renderContent = () => {
    return sortedAssets.map((asset: IAsset) => (
      <Table.Row
        key={asset.asset_id}
        className={selectedAsset?.asset_id === asset.asset_id ? styles.selected : ''}
        onClick={() => onSelectAsset(asset)}
      >

        {onChangeCheckedAssets && <Table.Cell>
          <Checkbox
            checked={checkedAssets.includes(asset.asset_id)}
            onClick={(e) => {
              e.stopPropagation();
              setCheckedAssets(prev => {
                if (prev.includes(asset.asset_id)) {
                  return prev.filter(id => id !== asset.asset_id);
                }
                return [...prev, asset.asset_id];
              });
            }}
          />
        </Table.Cell>}

        <Table.Cell>{asset.file.file_name}</Table.Cell>
        <Table.Cell>{calculateFileSize(asset.file.size_in_bytes)}</Table.Cell>
        {!isReadOnly && (
          <Table.Cell style={{textAlign: 'right'}}>
            <Button
              style={{padding: '0 6px 0'}}
              className='buttonLink'
              onClick={(e) => {
                e.stopPropagation();
                deleteAsset(asset.asset_id);
                console.log(asset.asset_id, ' from delete');
              }}
            >
              Delete
            </Button>|
            <Button
              style={{padding: '0 6px 0'}}
              className='buttonLink'
              onClick={(e) => {
                e.stopPropagation();
                console.log(asset.asset_id, ' from download');
              }}
            >
              Download
            </Button>
          </Table.Cell>
        )}
      </Table.Row>
    ));
  };

  return (
    <div className={`${className || ''} ${styles.assetTable}`} style={style}>
      <Segment
        loading={loading} raised={true}
        basic={true} style={{padding: '0px'}}
      >
        <div className='scrollableTable'>
          <Table
            className={styles.table} celled={true}
            singleLine={true}
          >
            <Table.Header>
              {renderHeader()}
            </Table.Header>
            <Table.Body>
              {renderContent()}
            </Table.Body>
          </Table>
        </div>
      </Segment>
    </div>
  );
};

export default AssetTable;



