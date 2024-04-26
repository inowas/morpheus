import {AccordionRef, DataGrid, Grid, InfoTitle, SectionTitle, Tab} from 'common/components';
import React, {useEffect, useState} from 'react';
import {IBoundaries} from './type/BoundariesContent.type';
import boundariesData from './boundaries.json';
import {BoundariesTable} from './BoundariesTable/';
import {BoundariesForm} from './BoundariesForm/';
import {MenuItem, TabPane} from 'semantic-ui-react';
import {SelectedList} from '../SelectedList';
import {v4 as uuidv4} from 'uuid';


const BoundariesContent: React.FC = () => {

  // @ts-expect-error IBoundaries type
  const [boundaries, setBoundaries] = useState<IBoundaries[]>(boundariesData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<string[]>([]);

  useEffect(() => {
    console.log({'selectedItems': selectedItems, 'selectedObservation': selectedObservation});
  }, [selectedObservation, selectedItems]);

  const handleSelectItem = (items: string[]) => {
    setSelectedItems(items);
  };
  const handleSelectObservation = (items: string[]) => {
    setSelectedObservation(items);
  };
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

  return <>
    <DataGrid>
      <SectionTitle title={'MODEL BOUNDARIES'}/>
      <AccordionRef
        defaultActiveIndex={[0]}
        className='accordionPrimary'
        panels={[
          {
            key: 1,
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
                <>
                  <Grid.Grid
                    columns={2}
                    stackable={true}
                    responsive={true}
                    variant='secondary'
                  >
                    <Grid.Column width={9}>
                      <SelectedList
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        selectedObservations={selectedObservation}
                        onSelect={handleSelectItem}
                        onSelectObservations={handleSelectObservation}
                        onDelete={handleBoundarieDelete}
                        onCopy={handleBoundarieCopy}
                      />
                    </Grid.Column>
                    <Grid.Column width={7} style={{marginTop: '12px'}}>
                      <InfoTitle
                        title="Properties"
                        secondary={true}
                        actions={[
                          {actionText: 'Edit on map', onClick: () => console.log('Action 2')},
                        ]}
                      />
                      <BoundariesForm
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        onSelect={handleSelectItem}
                      />
                    </Grid.Column>
                  </Grid.Grid>
                  <Grid.Grid>
                    <Tab
                      style={{width: '100%'}}
                      variant='primary'
                      menu={{secondary: true, pointing: true}}
                      panes={[
                        {
                          menuItem: (
                            <MenuItem key='table'>
                              Table
                            </MenuItem>
                          ),
                          render: () => <TabPane attached={false}>
                            <BoundariesTable
                              boundaries={boundaries}
                              selectedObservation={selectedObservation}
                            />
                          </TabPane>,
                        },
                        {
                          menuItem: (
                            <MenuItem
                              key='Chart'
                            >
                              Chart
                            </MenuItem>
                          ),
                          render: () => <TabPane attached={false}>
                            Chart
                          </TabPane>,
                        },
                      ]}
                    />
                  </Grid.Grid>
                </>

              ),
            },
            isOpen: false,
          },
          {
            key: 2,
            title: {
              content: (
                <div>
                  <span>WEL</span>
                  <span>Well Boundaries 2</span>
                  <span>(36)</span>
                </div>
              ),
              icon: false,
            },
            content: {
              content: (
                <p style={{padding: '20px'}}>Some clay-silt lenses. <br/> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima
                  numquam
                  porro quia, quibusdam
                  sapiente
                  tempore
                  vitae!</p>
              ),
            },
            isOpen: false,
          },
        ]}
        exclusive={false}
      />
    </DataGrid>
  </>
  ;
};

export default BoundariesContent;
