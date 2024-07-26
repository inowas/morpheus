import React, {useEffect} from 'react';
import {Button, Grid, List, ListContent, ListIcon, ListItem, Segment} from 'semantic-ui-react';
import {IImportItem} from './Import.type';

interface IProps {
  items: IImportItem[];
  excludedIdx: number[]
  onChangeExcludedIdx: (excludedItems: number[]) => void;
}


const ImportItemsUploadSelector = ({items, excludedIdx, onChangeExcludedIdx}: IProps) => {

  useEffect(() => {
    onChangeExcludedIdx([]);
  }, [items]);

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={6}>
          <Segment>
            <h3>Data Info</h3>
            <p>Number of boundaries: {items.length}</p>
            <p>Selected: {items.length - excludedIdx.length}</p>
          </Segment>
        </Grid.Column>
        <Grid.Column width={10}>
          <Segment>
            <List divided={true} verticalAlign='middle'>
              {items.map((boundary, idx) => {
                if (excludedIdx.includes(idx)) {
                  return null;
                }
                return (
                  <ListItem key={idx}>
                    <ListContent floated='right'>
                      <Button icon={'trash'} onClick={() => onChangeExcludedIdx([...excludedIdx, idx])}/>
                    </ListContent>
                    <ListIcon name='map marker alternate'/>
                    {boundary.name || 'No name'}
                  </ListItem>
                );
              })}
            </List>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ImportItemsUploadSelector;
