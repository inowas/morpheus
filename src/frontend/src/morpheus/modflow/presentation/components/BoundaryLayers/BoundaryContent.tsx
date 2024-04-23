import {DataGrid, Grid, InfoTitle, MovableAccordionList, SectionTitle} from 'common/components';
import React, {useState} from 'react';
import {Dropdown, Form} from 'semantic-ui-react';
// import {ZonesList} from '../ZonesList';
import jsonData from './items.json';
import boundaryItems from './boundary.json';
import {SelectedList} from '../SelectedList';


// const zones = [
//   {name: 'Green Land', coordinates: 732.46},
//   {name: 'Red Land', coordinates: 536.21},
//   {name: 'Blue Land', coordinates: 93.22},
//   {name: 'Yellow Land', coordinates: 452.00},
//   {name: 'Purple Land', coordinates: 621.67},
//   {name: 'Orange Land', coordinates: 732.46},
//   {name: 'Cyan Land', coordinates: 93.22},
//   {name: 'Magenta Land', coordinates: 2.46},
// ];

const BoundaryContent: React.FC = () => {
  const layers = jsonData.map(item => ({id: item.id, name: item.name, sub_layers: item.sub_layers}));
  // console.log(boundaryItems);

  const movableItems: any = [
    {
      key: 1123123,
      title: {
        content: (
          <div>
            <span>WEL</span>
            <span>Well Boundaries</span>
            <span>(396)</span>
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
              <SelectedList items={layers} boundary={boundaryItems}/>
            </Grid.Column>
            <Grid.Column>
              <InfoTitle
                title="Properties"
                secondary={true}
                actions={[
                  {actionText: 'Edit on map', onClick: () => console.log('Action 2')},
                ]}
              />
              <Form>
                <Grid.Grid columns='equal'>
                  <Grid.Row>
                    <Grid.Column>
                      <Dropdown
                        name="selectedLayer"
                        clearable={true}
                        multiple={true}
                        selection={true}
                        options={layers.map(layer => ({
                          key: layer.id,
                          value: layer.name,
                          text: <span>{layer.name}</span>,
                        }))}
                        placeholder="Select Layer"
                        // value={filterParams.users || []}
                        // onChange={(_, {value}) => {
                        //   if (Array.isArray(value)) {
                        //     const selectedOptions = value.map(option => String(option));
                        //     onChangeFilterParams({...filterParams, users: 0 < selectedOptions.length ? selectedOptions : undefined});
                        //   }
                        // }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Field>
                        <Form.Input label="Name" placeholder="Name"/>
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field>
                        <Form.Input label="Name" placeholder="Name"/>
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Field>
                        <Form.TextArea label="Name" placeholder="Name"/>
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                </Grid.Grid>
              </Form>

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
          'Some clay-silt lenses'
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
    {
      key: 3,
      title: {
        content: (
          'New Content 2'
        ),
        icon: false,
      },
      content: {
        content: (
          <p style={{padding: '20px'}}>New content for item 2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam porro
            quia, quibusdam sapiente
            tempore vitae!</p>
        ),
      },
      isOpen: false,

    },
  ];

  const [movableListItems, setMovableListItems] = useState<any[]>(movableItems);
  const onMovableListChange = (newItems: any) => {
    setMovableListItems(newItems);
  };

  return <>
    <DataGrid>
      <SectionTitle title={'MODEL BOUNDARIES'}/>
      <MovableAccordionList
        defaultOpenIndexes={[0, 1, 2, 3]}
        items={movableListItems}
        onMovableListChange={onMovableListChange}
        renameItems={false}
      />
    </DataGrid>
  </>
  ;
};

export default BoundaryContent;
