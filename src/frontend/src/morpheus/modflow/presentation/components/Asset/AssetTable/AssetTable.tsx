import React, {useEffect, useMemo, useState} from 'react';
import {Checkbox, Segment, Table} from 'semantic-ui-react';
import {Button} from 'common/components';
import styles from './AssetTable.module.less';

import {IAsset, IAssetId} from '../../../../types';
import FileNameInput from './FileNameInput';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  assets: IAsset[];
  loadingAsset: IAssetId | false;
  loadingList: boolean;
  deleteAsset: (id: string) => void;
  updateAssetFileName: (id: string, fileName: string) => void;
  isReadOnly: boolean;
  selectedAsset: IAsset | null;
  onSelectAsset: (asset: IAsset) => void;
  onChangeCheckedAssets?: (assetId: IAssetId[] | null) => void;
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
  assets,
  loadingList,
  deleteAsset,
  updateAssetFileName,
  isReadOnly,
  selectedAsset,
  onSelectAsset,
  onChangeCheckedAssets,
}: IProps) => {

  const [checkedAssets, setCheckedAssets] = useState<string[]>([]);
  const [editAssetFileNameId, setEditAssetFileNameId] = useState<string | null>(null);

  useEffect(() => {
    if (onChangeCheckedAssets) {
      onChangeCheckedAssets(checkedAssets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedAssets]);

  useEffect(() => {
    if (!selectedAsset || !assets.find((asset) => asset.asset_id === selectedAsset.asset_id)) {
      if (0 < assets.length) {
        onSelectAsset(assets[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  const sortedAssets = useMemo(() => {
    return assets.toSorted((a, b) => {
      if (a.file.file_name < b.file.file_name) {
        return -1;
      }
      if (a.file.file_name > b.file.file_name) {
        return 1;
      }
      return 0;
    });
  }, [assets]);

  const handleSelectAll = () => {
    if (checkedAssets.length === assets.length) {
      return setCheckedAssets([]);
    }
    return setCheckedAssets(assets.map((asset) => asset.asset_id));
  };

  const renderHeader = () => (
    <Table.Row>
      {onChangeCheckedAssets &&
        <Table.HeaderCell>
          <Checkbox checked={checkedAssets.length === assets.length} onClick={handleSelectAll}/>
        </Table.HeaderCell>}
      <Table.HeaderCell>
        <div>
          File name
        </div>
      </Table.HeaderCell>
      <Table.HeaderCell>
        <div>
          File size
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

        <Table.Cell>
          <FileNameInput
            value={asset.file.file_name}
            onChange={(fileName) => updateAssetFileName(asset.asset_id, fileName)}
            isReadOnly={isReadOnly}
            edit={editAssetFileNameId === asset.asset_id}
            onChangeEdit={(edit) => setEditAssetFileNameId(edit ? asset.asset_id : null)}
          />
        </Table.Cell>
        <Table.Cell>{calculateFileSize(asset.file.size_in_bytes)}</Table.Cell>
        {!isReadOnly && (
          <Table.Cell style={{textAlign: 'right'}}>
            <Button
              style={{padding: '0 5px 0'}}
              className='buttonLink'
              onClick={(e) => {
                e.stopPropagation();
                setEditAssetFileNameId(asset.asset_id);
              }}
              icon={'edit'}
            />
            <Button
              style={{padding: '0 5px 0'}}
              className='buttonLink'
              onClick={(e) => {
                e.stopPropagation();
              }}
              icon={'download'}
            />
            <Button
              style={{padding: '0 5px 0', color: '#db2828'}}
              className='buttonLink'
              onClick={(e) => {
                e.stopPropagation();
                deleteAsset(asset.asset_id);
              }}
              icon={'trash'}
            />
          </Table.Cell>
        )}
      </Table.Row>
    ));
  };

  return (
    <div className={`${className || ''} ${styles.assetTable}`} style={style}>
      <Segment
        raised={true}
        basic={true}
        style={{padding: '0px'}}
        loading={loadingList}
      >
        {0 === assets.length && (
          <div style={{padding: '10px', textAlign: 'center'}}>
            There are no files uploaded yet.
          </div>
        )}

        {0 < assets.length && (
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
        )}
      </Segment>
    </div>
  );
};

export default AssetTable;



