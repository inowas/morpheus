import {AccordionRef, DataGrid, Grid, InfoTitle, SectionTitle, Tab} from 'common/components';
import React, {useState} from 'react';
import {IBoundaries} from './type/BoundariesContent.type';
import {getBoundariesByType} from './helpers/BoundariesContent.helpers';
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

  React.useEffect(() => {
    console.log(boundaries);
    console.log(selectedItems);
  }, [selectedItems]);

  const handleSelectItem = (items: string[]) => {
    setSelectedItems(items);
  };

  const handleSelectObservation = (items: string[]) => {
    setSelectedObservation(items);
  };

  const handleBoundarieRename = (id: string | number, newTitle: string) => {
    boundaries.forEach((boundary) => {
      if (boundary.id === id) {
        boundary.name = newTitle;
      }
    });
  };

  const handleBoundarieDelete = (id: number | string) => {
    setBoundaries(prevState => prevState.filter(boundary => boundary.id !== id));
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
                  <span>GHB</span>
                  <span>General Head Boundaries</span>
                  <span>{`(${getBoundariesByType(boundaries, 'general_head').length})`}</span>
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
                        type='general_head'
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        selectedObservations={selectedObservation}
                        onSelect={handleSelectItem}
                        onSelectObservations={handleSelectObservation}
                        onRename={handleBoundarieRename}
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
                        type='general_head'
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        onSelect={handleSelectItem}
                        onSelectObservations={handleSelectObservation}

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
                              type='general_head'
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
                  <span>Well Boundaries </span>
                  <span>{`(${getBoundariesByType(boundaries, 'well').length})`}</span>
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
                        type='well'
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        selectedObservations={selectedObservation}
                        onSelect={handleSelectItem}
                        onSelectObservations={handleSelectObservation}
                        onRename={handleBoundarieRename}
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
                        type='well'
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        onSelect={handleSelectItem}
                        onSelectObservations={handleSelectObservation}

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
                              type='well'
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
            key: 3,
            title: {
              content: (
                <div>
                  <span>REC</span>
                  <span>Recharge</span>
                  <span>{`(${getBoundariesByType(boundaries, 'recharge').length})`}</span>
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
                        type='recharge'
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        selectedObservations={selectedObservation}
                        onSelect={handleSelectItem}
                        onRename={handleBoundarieRename}
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
                        type='recharge'
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        onSelect={handleSelectItem}
                        onSelectObservations={handleSelectObservation}

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
                              type='recharge'
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
            key: 4,
            title: {
              content: (
                <div>
                  <span>RIV</span>
                  <span>River</span>
                  <span>{`(${getBoundariesByType(boundaries, 'river').length})`}</span>
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
                        type='river'
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        selectedObservations={selectedObservation}
                        onSelect={handleSelectItem}
                        onRename={handleBoundarieRename}
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
                        type='river'
                        boundaries={boundaries}
                        selectedItems={selectedItems}
                        onSelect={handleSelectItem}
                        onSelectObservations={handleSelectObservation}

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
                              type='river'
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
            key: 5,
            title: {
              content: (
                <div>
                  <span>All</span>
                  <span>All boundaries</span>
                  <span>{`(${boundaries.length})`}</span>
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
                        onRename={handleBoundarieRename}
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
                        onSelectObservations={handleSelectObservation}

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
        ]}
        exclusive={false}
      />
    </DataGrid>
  </>
  ;
};

export default BoundariesContent;
