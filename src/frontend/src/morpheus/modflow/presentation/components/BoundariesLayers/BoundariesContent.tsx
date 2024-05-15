import {AccordionRef, Button, DataGrid, Grid, InfoTitle, SectionTitle, Tab} from 'common/components';
import React, {useState} from 'react';
import {IBoundaries} from './type/BoundariesContent.type';
import {getBoundariesByType} from './helpers/BoundariesContent.helpers';
import boundariesData from './boundaries.json';
import {BoundariesTable} from './BoundariesTable/';
import {BoundariesForm} from './BoundariesForm/';
import {MenuItem, TabPane} from 'semantic-ui-react';
import {SelectedList} from '../SelectedList';
import {v4 as uuidv4} from 'uuid';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const BoundariesContent: React.FC = () => {

  // @ts-expect-error IBoundaries type
  const [boundaries, setBoundaries] = useState<IBoundaries[]>(boundariesData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<string[]>([]);

  const handleSelectItem = (items: string[]) => {
    setSelectedItems(items);
  };

  const handleSelectObservation = (items: string[]) => {
    setSelectedObservation(items);
  };

  const handleItemRename = (id: string | number, newTitle: string, observationId?: string) => {
    const itemToRenameIndex = boundaries.findIndex(boundaryItem => boundaryItem.id === id);
    if (-1 === itemToRenameIndex) return;

    const boundaryToRename = boundaries[itemToRenameIndex];

    // If observationId is provided, rename only that observation
    if (observationId) {
      const newObservations = boundaryToRename.observations.map(obs => {
        if (obs.observation_id === observationId) {
          return {
            ...obs,
            observation_name: newTitle,
          };
        }
        return obs;
      });

      const newBoundaries = boundaries.map((boundaryItem, index) => {
        if (index === itemToRenameIndex) {
          return {
            ...boundaryItem,
            observations: newObservations,
          };
        }
        return boundaryItem;
      });

      setBoundaries(newBoundaries);
    } else {
      // If observationId is not provided, rename the full boundary item
      const newBoundaries = boundaries.map((boundaryItem, index) => {
        if (index === itemToRenameIndex) {
          return {
            ...boundaryItem,
            name: newTitle,
          };
        }
        return boundaryItem;
      });

      setBoundaries(newBoundaries);
    }
  };

  const handleItemDelete = (id: number | string, observationId?: string) => {
    // If observationId is provided, delete only that observation
    if (observationId) {
      const itemToDeleteIndex = boundaries.findIndex(boundaryItem => boundaryItem.id === id);
      if (-1 === itemToDeleteIndex) return;
      const boundaryToDelete = boundaries[itemToDeleteIndex];
      const newObservations = boundaryToDelete.observations.filter(obs => obs.observation_id !== observationId);

      const newBoundaries = boundaries.map((boundaryItem, index) => {
        if (index === itemToDeleteIndex) {
          return {
            ...boundaryItem,
            observations: newObservations,
          };
        }
        return boundaryItem;
      });

      setBoundaries(newBoundaries);
    } else {
      // If observationId is not provided, delete the full boundary item
      setBoundaries(prevState => prevState.filter(boundary => boundary.id !== id));
    }
  };

  const handleItemCopy = (id: number | string, observationId?: string) => {
    const itemToCopyIndex = boundaries.findIndex(boundaryItem => boundaryItem.id === id);
    if (-1 === itemToCopyIndex) return;
    const boundaryToCopy = boundaries[itemToCopyIndex];

    // If observationId is provided, find and copy only that observation
    if (observationId) {
      const observationToCopyIndex = boundaryToCopy.observations.findIndex(obs => obs.observation_id === observationId);
      if (-1 !== observationToCopyIndex) {
        const observationToCopy = boundaryToCopy.observations.find(obs => obs.observation_id === observationId);
        const newObservationId = uuidv4();
        const newName = observationToCopy!.observation_name!.includes('copy') ? observationToCopy!.observation_name : `${observationToCopy!.observation_name} copy`;
        const copiedObservation = {
          ...boundaryToCopy.observations[observationToCopyIndex],
          observation_id: newObservationId,
          observation_name: newName,
        };
        const newObservations = [...boundaryToCopy.observations];
        newObservations.splice(observationToCopyIndex + 1, 0, copiedObservation);

        const newBoundaries = boundaries.map((boundaryItem, index) => {
          if (index === itemToCopyIndex) {
            return {
              ...boundaryItem,
              observations: newObservations,
            };
          }
          return boundaryItem;
        });

        setBoundaries(newBoundaries);
      }
    } else {
      // If observationId is not provided, copy the full boundary item
      const newId = uuidv4();
      const newName = boundaryToCopy.name.includes('copy') ? boundaryToCopy.name : `${boundaryToCopy.name} copy`;
      const copiedItem = {...boundaryToCopy, id: newId, name: newName};
      const newBoundaries = [...boundaries];
      newBoundaries.splice(itemToCopyIndex + 1, 0, copiedItem);
      setBoundaries(newBoundaries);
    }
  };

  return <>

    <AccordionRef
      defaultActiveIndex={0}
      className='accordionPrimary'
      // exclusive value - if true, only one panel can be open at a time
      // exclusive={false}
      // defaultActiveIndex={[0]}
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
                      onRename={handleItemRename}
                      onDelete={handleItemDelete}
                      onCopy={handleItemCopy}
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
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '10px',
                    marginLeft: 'auto',
                  }}
                  >
                    <Button
                      className='buttonLink'
                      disabled={0 === selectedItems.length}
                      onClick={() => console.log('general_head')}
                    >
                      Delete all values <FontAwesomeIcon icon={faTrashCan}/>
                    </Button>
                    <Button
                      className='buttonLink'
                      disabled={0 === selectedItems.length}
                    >
                      Download <FontAwesomeIcon icon={faDownload}/></Button>
                  </div>
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
                      onRename={handleItemRename}
                      onDelete={handleItemDelete}
                      onCopy={handleItemCopy}
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
                  variant='secondary'
                >
                  <Grid.Column width={9}>
                    <SelectedList
                      type='recharge'
                      boundaries={boundaries}
                      selectedItems={selectedItems}
                      selectedObservations={selectedObservation}
                      onSelect={handleSelectItem}
                      onRename={handleItemRename}
                      onSelectObservations={handleSelectObservation}
                      onDelete={handleItemDelete}
                      onCopy={handleItemCopy}
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
                  variant='secondary'
                >
                  <Grid.Column width={9}>
                    <SelectedList
                      type='river'
                      boundaries={boundaries}
                      selectedItems={selectedItems}
                      selectedObservations={selectedObservation}
                      onSelect={handleSelectItem}
                      onRename={handleItemRename}
                      onSelectObservations={handleSelectObservation}
                      onDelete={handleItemDelete}
                      onCopy={handleItemCopy}
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
                  variant='secondary'
                >
                  <Grid.Column width={9}>
                    <SelectedList
                      boundaries={boundaries}
                      selectedItems={selectedItems}
                      selectedObservations={selectedObservation}
                      onSelect={handleSelectItem}
                      onRename={handleItemRename}
                      onSelectObservations={handleSelectObservation}
                      onDelete={handleItemDelete}
                      onCopy={handleItemCopy}
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
    />
  </>;
};

export default BoundariesContent;
