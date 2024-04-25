import {DataGrid, DotsMenu, Grid, InfoTitle, SectionTitle} from 'common/components';
import React, {useEffect, useState} from 'react';
import {IBoundaries} from './type/BoundariesContent.type';
import boundariesData from './boundaries.json';
import {SelectedList} from '../SelectedList';
import {Accordion} from 'semantic-ui-react';
import {v4 as uuidv4} from 'uuid';


const BoundariesContent: React.FC = () => {

  // @ts-expect-error IBoundaries type
  const [boundaries, setBoundaries] = useState<IBoundaries[]>(boundariesData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  const handleBoundarieDelete = (id: number | string) => {
    setBoundaries(boundaries.filter(boundarieItem => boundarieItem.id !== id));
  };
  const handleBoundarieCopy = (id: number | string) => {
    const itemToCopyIndex = boundaries.findIndex(boundaryItem => boundaryItem.id === id);
    if (-1 === itemToCopyIndex) return;
    const newId = uuidv4();
    const copiedItem = {...boundaries[itemToCopyIndex], id: newId};
    const newBoundaries = [...boundaries];
    newBoundaries.splice(itemToCopyIndex + 1, 0, copiedItem);
    setBoundaries(newBoundaries);
  };


  const panels = [
    {
      key: 1,
      title: {
        content: (
          <div className='customTitle'>
            <DotsMenu
              actions={[
                {text: 'Delete', icon: 'remove', onClick: () => console.log('delete')},
              ]}
            />
            <div>
              <span>WEL</span>
              <span>Well Boundaries</span>
              <span>(396)</span>
            </div>
          </div>
        ),
        icon: false,
      },
      content: {
        content: (
          <Grid.Grid
            columns={2}
            stackable={true}
            responsive={true}
            variant='secondary'
          >
            <Grid.Column>
              <SelectedList
                boundaries={boundaries}
                onSelect={setSelectedItems}
                onDelete={handleBoundarieDelete}
                onCopy={handleBoundarieCopy}
              />
            </Grid.Column>
            <Grid.Column>
              <InfoTitle
                title="Properties"
                secondary={true}
                actions={[
                  {actionText: 'Edit on map', onClick: () => console.log('Action 2')},
                ]}
              />
              {/*<Form>*/}
              {/*  <Grid.Grid columns='equal'>*/}
              {/*    <Grid.Row>*/}
              {/*      <Grid.Column>*/}
              {/*        <Dropdown*/}
              {/*          name="selectedLayer"*/}
              {/*          clearable={true}*/}
              {/*          multiple={true}*/}
              {/*          selection={true}*/}
              {/*          // options={boundary.map(layer => ({*/}
              {/*          //   key: layer.id,*/}
              {/*          //   value: layer.name,*/}
              {/*          //   text: <span>{layer.name}</span>,*/}
              {/*          // }))}*/}
              {/*          placeholder="Select Layer"*/}
              {/*          // value={filterParams.users || []}*/}
              {/*          // onChange={(_, {value}) => {*/}
              {/*          //   if (Array.isArray(value)) {*/}
              {/*          //     const selectedOptions = value.map(option => String(option));*/}
              {/*          //     onChangeFilterParams({...filterParams, users: 0 < selectedOptions.length ? selectedOptions : undefined});*/}
              {/*          //   }*/}
              {/*          // }}*/}
              {/*        />*/}
              {/*      </Grid.Column>*/}
              {/*    </Grid.Row>*/}
              {/*    <Grid.Row>*/}
              {/*      <Grid.Column>*/}
              {/*        <Form.Field>*/}
              {/*          <Form.Input label="Name" placeholder="Name"/>*/}
              {/*        </Form.Field>*/}
              {/*      </Grid.Column>*/}
              {/*      <Grid.Column>*/}
              {/*        <Form.Field>*/}
              {/*          <Form.Input label="Name" placeholder="Name"/>*/}
              {/*        </Form.Field>*/}
              {/*      </Grid.Column>*/}
              {/*    </Grid.Row>*/}
              {/*    <Grid.Row>*/}
              {/*      <Grid.Column>*/}
              {/*        <Form.Field>*/}
              {/*          <Form.TextArea label="Name" placeholder="Name"/>*/}
              {/*        </Form.Field>*/}
              {/*      </Grid.Column>*/}
              {/*    </Grid.Row>*/}
              {/*  </Grid.Grid>*/}
              {/*</Form>*/}
            </Grid.Column>
          </Grid.Grid>

        ),
      },
      isOpen: false,
    },
    {
      key: 2,
      title: {
        content: (
          <div className='customTitle'>
            {/*<DotsMenu*/}
            {/*  actions={[*/}
            {/*    {text: 'Delete', icon: 'remove', onClick: () => handlePanelDelete(2)},*/}
            {/*  ]}*/}
            {/*/>*/}
            <div>
              <span>WEL</span>
              <span>Well Boundaries 2</span>
              <span>(36)</span>
            </div>
          </div>
        ),
        icon: false,
      },
      content: {
        content: (
          <p style={{padding: '20px'}}>Some clay-silt lenses. <br/> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam
            porro quia, quibusdam
            sapiente
            tempore
            vitae!</p>
        ),
      },
      isOpen: false,
    },
  ];

  return <>
    <DataGrid>
      <SectionTitle title={'MODEL BOUNDARIES'}/>
      <Accordion
        defaultActiveIndex={[0]}
        className='accordionPrimary'
        panels={panels}
        exclusive={false}
      />
    </DataGrid>
  </>
  ;
};

export default BoundariesContent;
