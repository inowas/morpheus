import React, {useEffect} from 'react';
import {Grid, Icon, List, ListContent, ListIcon, ListItem, Segment} from 'semantic-ui-react';
import {IImportItem} from '../../../types/Import.type';
import {Map} from 'common/components/Map';
import SelectImportItemsMapLayer from './SelectImportItemsMapLayer';
import {ISpatialDiscretization} from '../../../types';
import styles from './ImportItemsUploadSelector.module.less';

interface IProps {
  items: IImportItem[];
  includedForUploadIdx: number[]
  onChangeIncludedForUploadIdx: (includedItems: number[]) => void;
  spatialDiscretization: ISpatialDiscretization;
}


const ImportItemsUploadSelector = ({items, includedForUploadIdx, onChangeIncludedForUploadIdx, spatialDiscretization}: IProps) => {

  useEffect(() => {
    onChangeIncludedForUploadIdx([]);
  }, [items]);

  const handleSelectAll = () => {
    const all = items.map((_, idx) => idx);
    onChangeIncludedForUploadIdx(all);
  };

  const handleDeselectAll = () => {
    onChangeIncludedForUploadIdx([]);
  };

  const handleClickItem = (idx: number) => {
    if (includedForUploadIdx.includes(idx)) {
      return onChangeIncludedForUploadIdx(includedForUploadIdx.filter((i) => i !== idx));
    }

    return onChangeIncludedForUploadIdx([...includedForUploadIdx, idx]);
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={6}>
          <Segment>
            <h3>Data Info</h3>
            <p>Number of available items: {items.length}</p>
            <p>Selected: {includedForUploadIdx.length}</p>
          </Segment>
          <Segment style={{
            maxHeight: '40vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          >
            <List divided={true} verticalAlign='middle'>
              {items.map((boundary, idx) => {
                return (
                  <ListItem
                    className={styles.importListItem}
                    key={idx} onClick={() => handleClickItem(idx)}
                    style={{cursor: 'pointer'}}
                  >
                    <ListContent floated='right'>
                      <div>
                        <Icon
                          name={includedForUploadIdx.includes(idx) ? 'check square outline' : 'square outline'}
                          size={'large'}
                        />
                      </div>
                    </ListContent>
                    <ListIcon name='map marker alternate'/>
                    {boundary.name || 'No name'}
                  </ListItem>
                );
              })}
            </List>
          </Segment>
        </Grid.Column>
        <Grid.Column width={10}>
          <Map>
            <SelectImportItemsMapLayer
              modelDomain={spatialDiscretization.geometry}
              items={{
                type: 'FeatureCollection',
                features: items.map((item, idx) => ({
                  type: 'Feature',
                  geometry: item.geometry,
                  properties: {
                    id : idx,
                    name: item.name || 'No name',
                    selected: includedForUploadIdx.includes(idx),
                  },
                })),
              }}
              onClickItem={handleClickItem}
              onSelectItems={onChangeIncludedForUploadIdx}
            />
          </Map>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ImportItemsUploadSelector;
