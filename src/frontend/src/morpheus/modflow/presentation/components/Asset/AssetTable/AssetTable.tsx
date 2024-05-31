import React, {useEffect, useState} from 'react';
import {Button, SortButtons} from 'common/components';
import {Checkbox, Segment, Table} from 'semantic-ui-react';
import styles from './AssetTable.module.less';
import {IAsset} from '../../../../types';
import {useDateTimeFormat} from '../../../../../../common/hooks';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  fileType: string;
  assets: IAsset[];
  loading: boolean;
  deleteAsset: (id: string) => void;
  isReadOnly: boolean;
  selectedAsset: string | null;
  onAssetSelect: (assetId: string | null) => void;
}

interface IExtendedAsset extends IAsset {
  date: string;
  author: string;
}

const AssetTable = ({style, className, fileType, assets, loading, deleteAsset, isReadOnly, selectedAsset, onAssetSelect}: IProps) => {
  const [showAll, setShowAll] = useState(false);
  const [checkedAssets, setCheckedAssets] = useState<string[]>([]);


  /*
  * Mock data for testing
  *
  * */
  const {format} = useDateTimeFormat();
  const [updatedAssets, setUpdatedAssets] = useState<IExtendedAsset[]>();
  const usersList = [
    'Alice Smith', 'Bob Johnson', 'Charlie Williams', 'David Brown', 'Emma Jones',
    'Frank Miller', 'Grace Davis', 'Henry Garcia', 'Isabella Rodriguez', 'Jack Wilson',
  ];
  const generateRandomDate = () => {
    const startDate = new Date('2020-01-01').getTime();
    const endDate = new Date('2025-12-31').getTime();
    const randomTime = startDate + Math.random() * (endDate - startDate);
    return new Date(randomTime);
  };

  const generateRandomFullName = () => {
    const randomIndex = Math.floor(Math.random() * usersList.length);
    return usersList[randomIndex];
  };

  useEffect(() => {
    setShowAll(false);
    const refAssets = assets.map((asset) => ({
      ...asset,
      date: format(generateRandomDate().toISOString(), 'dd.MM.yyyy HH:mm'),
      author: generateRandomFullName(),
    }));
    setUpdatedAssets(refAssets);
  }, [fileType, assets]);
  /*
  * End mock data for testing
  *
  * */

  const handleSelectAll = () => {
    setShowAll(!showAll);
    const result: string[] = [];
    if (!showAll) {
      assets.forEach((asset) => {
        result.push(asset.asset_id);
      });
    }
    setCheckedAssets(result);
  };

  const handleSort = (direction: 'asc' | 'desc', name: string | undefined) => {
    const sortedAssets = [...(updatedAssets || [])].sort((a, b) => {
      switch (name) {
      case 'upload_date': {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        console.log(dateA, dateB);
        return 'asc' === direction ? dateA - dateB : dateB - dateA;
      }
      case 'file_name':
        return 'asc' === direction
          ? a.file.file_name.localeCompare(b.file.file_name)
          : b.file.file_name.localeCompare(a.file.file_name);
      case 'author':
        return 'asc' === direction
          ? a.author.localeCompare(b.author)
          : b.author.localeCompare(a.author);
      default :
        return 0;
      }
    });
    setUpdatedAssets(sortedAssets);
  };

  const renderHeader = () => (
    <Table.Row>
      <Table.HeaderCell>
        <Checkbox checked={showAll} onClick={handleSelectAll}/>
      </Table.HeaderCell>
      <Table.HeaderCell>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          Upload date
          <SortButtons name={'upload_date'} onSort={handleSort}/>
        </div>
      </Table.HeaderCell>
      <Table.HeaderCell>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          File name
          <SortButtons name={'file_name'} onSort={handleSort}/>
        </div>
      </Table.HeaderCell>
      <Table.HeaderCell>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          Uploaded by
          <SortButtons name={'author'} onSort={handleSort}/>
        </div>
      </Table.HeaderCell>
      {!isReadOnly && <Table.HeaderCell></Table.HeaderCell>}
    </Table.Row>
  );

  const renderContent = () => {
    if (!updatedAssets) {
      return null;
    }
    return updatedAssets.map((asset: any) => (
      <Table.Row
        key={asset.asset_id}
        className={selectedAsset === asset.asset_id ? styles.selected : ''}
        onClick={() => onAssetSelect(asset.asset_id)}
      >
        <Table.Cell>
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
        </Table.Cell>
        <Table.Cell>
          {asset.date.split(' ')[0]}
          <span style={{marginLeft: 10}}>{asset.date.split(' ')[1]}</span></Table.Cell>
        <Table.Cell>{asset.file.file_name}</Table.Cell>
        <Table.Cell>{asset.author}</Table.Cell>
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



