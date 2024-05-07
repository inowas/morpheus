import {Accordion, Checkbox, Icon, List, ListItem} from 'semantic-ui-react';
import {Button, DotsMenu} from 'common/components';
import React, {useEffect, useState} from 'react';
import {IBoundaries} from '../BoundariesLayers/type/BoundariesContent.type';
import styles from './SelectedList.module.less';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {getBoundariesByType} from '../BoundariesLayers/helpers/BoundariesContent.helpers';
import {SelectedListHeader} from './SelectedListHeader';

interface ISelectedListProps {
  type?: string;
  boundaries: IBoundaries[];
  selectedItems: string[];
  selectedObservations: string[];
  onSelect: (id: string[]) => void;
  onSelectObservations: (id: string[]) => void;
  onRename: (id: string, name: string, observationsId?: string) => void;
  onDelete: (id: string, observationsId?: string) => void;
  onCopy: (id: string, observationsId?: string) => void;
}

function findObservationIds(id: string, data: IBoundaries[]) {
  const foundObject = data.find(obj => obj.id === id);
  if (foundObject && foundObject.observations) {
    return foundObject.observations.map(obs => obs.observation_id);
  } else {
    return [];
  }
}

const SelectedList = ({
  type,
  boundaries,
  selectedItems,
  selectedObservations,
  onSelect,
  onSelectObservations,
  onRename,
  onDelete,
  onCopy,
}: ISelectedListProps) => {
  const [listItems, setListItems] = useState<IBoundaries[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePanels, setActivePanels] = useState<number[]>([]);
  // List items with checked checkbox
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  // Rename boundaries title
  const [openEditingTitle, setOpenEditingTitle] = useState<number | string | null>(null);
  const [inputValue, setInputValue] = useState('');
  // Rename Observations title
  const [openEditingObservationTitle, setOpenEditingObservationTitle] = useState<number | string | null>(null);
  const [inputObservationValue, setInputObservationValue] = useState('');


  useEffect(() => {
    setListItems(type ? getBoundariesByType(boundaries, type) : boundaries);
  }, [boundaries]);

  // selectAll functionality
  useEffect(() => {
    if (selectAllChecked) {
      const selectedWithoutChecked: string[] = [];
      const updatedObservationSelection: string[] = [];
      listItems.forEach(item => {
        selectedWithoutChecked.push(item.id);
        item.observations.forEach(observation => {
          updatedObservationSelection.push(observation.observation_id);
        });
      });
      onSelect([...selectedWithoutChecked, ...selectedItems]);
      onSelectObservations([...updatedObservationSelection, ...selectedObservations]);
    } else {
      const removableItemsId: string[] = [];
      const removableObservationsId: string[] = [];
      listItems.forEach(item => {
        item.observations.forEach(observation => {
          removableObservationsId.push(observation.observation_id);
        });
        removableItemsId.push(item.id);
      });
      onSelect(selectedItems.filter(item => !removableItemsId.includes(item)));
      onSelectObservations(selectedObservations.filter(item => !removableObservationsId.includes(item)));
    }
  }, [selectAllChecked]);


  const handleItemSelect = (itemId: string, metaPressed: boolean) => {
    let updatedSelection: string[];
    let updatedObservationSelection: string[];
    let observationIds = findObservationIds(itemId, boundaries);
    if (metaPressed) {
      if (selectedItems.includes(itemId)) {
        updatedSelection = selectedItems.filter(item => item !== itemId);
        updatedObservationSelection = selectedObservations.filter(item => !observationIds.includes(item));
      } else {
        updatedObservationSelection = [...selectedObservations, ...observationIds];
        updatedSelection = [...selectedItems, itemId];
      }
    } else {
      updatedSelection = [itemId];
      updatedObservationSelection = observationIds;
    }
    setSelectAllChecked(false);
    onSelect(updatedSelection);
    onSelectObservations(updatedObservationSelection);

  };

  const handleObservationSelect = (itemId: string) => {
    let updatedSelection: string[];
    if (selectedObservations.includes(itemId)) {
      updatedSelection = selectedObservations.filter(item => item !== itemId);
    } else {
      updatedSelection = [...selectedObservations, itemId];
    }
    onSelectObservations(updatedSelection);
  };

  const handleItemDisabled = (itemId: string, index: number) => {
    let observationIds = findObservationIds(itemId, boundaries);
    if (selectedItems.includes(itemId)) {
      let updatedSelection = selectedItems.filter(item => item !== itemId);
      let updatedObservationSelection = selectedObservations.filter(item => !observationIds.includes(item));
      onSelect(updatedSelection);
      onSelectObservations(updatedObservationSelection);
    }
    setCheckedItems(prevSelected => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter(item => item !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
    if (activePanels.includes(index)) {
      setActivePanels(activePanels.filter(item => item !== index));
    }
  };

  const handleSearchChange = (event: React.MouseEvent<HTMLElement>, data: any) => {
    const query = data.value.toLowerCase();
    setSearchQuery(query);
    const filteredItems = getBoundariesByType(boundaries, type).filter(item =>
      item.name.toLowerCase().includes(query),
    );
    setListItems(filteredItems);
  };

  const handleDeleteSelected = () => {
    // Reset "Select All" checkbox
    setSelectAllChecked(false);

    // Update selected items list
    const updatedSelectedItems = selectedItems.filter(itemId => {
      const foundItem = listItems.find(item => item.id === itemId);
      if (foundItem) {
        onDelete(itemId);
        return false;
      }
      return true;
    });
    onSelect(updatedSelectedItems);

    // Update selected observations list
    const selectedObservationsToRemove = listItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => findObservationIds(item.id, boundaries))
      .flat();
    const updatedSelectedObservations = selectedObservations.filter(observationId =>
      !selectedObservationsToRemove.includes(observationId),
    );
    onSelectObservations(updatedSelectedObservations);

    // Update the list of items
    const updatedListItems = listItems.filter(item => !selectedItems.includes(item.id));
    setListItems(updatedListItems);
  };

  const toggleAccordion = (index: number) => {
    const newActivePanels = activePanels.includes(index)
      ? activePanels.filter(item => item !== index)
      : [...activePanels, index];
    setActivePanels(newActivePanels);
  };

  return (
    <>
      {/**/}
      {/*Header with select all checkbox*/}
      {/**/}
      <SelectedListHeader
        checked={0 === listItems.length ? false : selectAllChecked}
        onChange={() => setSelectAllChecked(prev => !prev)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      {/**/}
      {/*Body with list items*/}
      {/**/}
      <List className={styles.list}>
        {listItems.map((item, index) => (
          <ListItem
            key={item.id}
            className={styles.item}
          >
            <div
              // Title styles when item is selected
              className={`${styles.title} ${selectedItems.includes(item.id) ? styles.titleSelected : ''}`}
            >
              <div
                className={`${styles.titleInner} ${checkedItems.includes(item.id) ? styles.disabled : ''}`}
                onClick={(e) => handleItemSelect(item.id, e.metaKey)}
              >
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                />
                {openEditingTitle !== item.id && <div style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
                >
                  {item.name}
                </div>}
                {openEditingTitle === item.id && (
                  <div className={styles.renameField}>
                    <input
                      type='text'
                      value={inputValue}
                      placeholder={item.name}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setInputValue(newTitle);
                      }}
                    />
                    <button onClick={() => {
                      if (!inputValue) {
                        setOpenEditingTitle(null);
                        return;
                      }
                      onRename(item.id, inputValue);
                      setInputValue('');
                      setOpenEditingTitle(null);
                    }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
              <div
                className={styles.buttonsWrapper}
                style={{paddingRight: `${!item.observations[0].observation_name && '21px'}`}}
              >
                <Checkbox
                  disabled={openEditingTitle === item.id}
                  toggle={true}
                  checked={!checkedItems.includes(item.id)}
                  onChange={() => handleItemDisabled(item.id, index)}
                />
                <DotsMenu
                  disabled={openEditingTitle === item.id}
                  className={`${styles.dotsMenu} ${checkedItems.includes(item.id) ? styles.disabled : ''}`}
                  actions={[
                    {
                      text: 'Rename Item',
                      icon: 'edit',
                      onClick: () => setOpenEditingTitle(item.id),
                    },
                    {text: 'Copy', icon: 'copy', onClick: () => onCopy(item.id)},
                    {text: 'Delete', icon: 'remove', onClick: () => onDelete(item.id)},
                  ]}
                />
                {item.observations[0].observation_name && (
                  <Icon
                    className={`${checkedItems.includes(item.id) ? styles.disabled : ''}`}
                    name={`${activePanels.includes(index) ? 'angle down' : 'angle right'}`}
                    onClick={() => toggleAccordion(index)}
                  />
                )}
              </div>
            </div>
            {(item.observations[0].observation_name && item.observations[0].observation_id) && (
              <Accordion.Content
                className={styles.accordionContent}
                active={activePanels.includes(index)}
                style={{display: activePanels.includes(index) ? 'block' : 'none'}}
              >
                <List className={styles.listObservations}>
                  {item.observations.map((observation) => {
                    return (
                      <ListItem
                        key={observation.observation_id}
                        onClick={() => handleObservationSelect(observation.observation_id)}
                      >
                        <div className={styles.observationItem}>
                          <span>
                            <Checkbox
                              className={styles.checkboxObservation}
                              checked={selectedObservations.includes(observation.observation_id)}
                            />
                            {openEditingObservationTitle !== observation.observation_id && <div style={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}
                            >
                              {observation.observation_name}
                            </div>}
                          </span>
                          {openEditingObservationTitle === observation.observation_id && (
                            <div className={styles.renameField}>
                              <input
                                type='text'
                                value={inputObservationValue}
                                placeholder={observation.observation_name}
                                onChange={(e) => {
                                  const newTitle = e.target.value;
                                  setInputObservationValue(newTitle);
                                }}
                              />
                              <button onClick={() => {
                                if (!inputObservationValue) {
                                  setOpenEditingObservationTitle(null);
                                  return;
                                }
                                onRename(item.id, inputObservationValue, observation.observation_id);
                                setInputObservationValue('');
                                setOpenEditingObservationTitle(null);
                              }}
                              >
                                Apply
                              </button>
                            </div>
                          )}
                          <DotsMenu
                            className={`${styles.dotsMenu} ${checkedItems.includes(observation.observation_id) ? styles.disabled : ''}`}
                            disabled={openEditingObservationTitle === observation.observation_id}
                            actions={[
                              {
                                text: 'Rename Item',
                                icon: 'edit',
                                onClick: () => setOpenEditingObservationTitle(observation.observation_id),
                              },
                              {text: 'Copy', icon: 'copy', onClick: () => onCopy(item.id, observation.observation_id)},
                              {text: 'Delete', icon: 'remove', onClick: () => onDelete(item.id, observation.observation_id)},
                            ]}
                          />
                        </div>

                      </ListItem>
                    );
                  })}
                </List>
              </Accordion.Content>
            )}
          </ListItem>
        ))}
      </List>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
        <Button
          className='buttonLink'
          disabled={0 === selectedItems.length}
          onClick={handleDeleteSelected}
        >
          Delete selected <FontAwesomeIcon icon={faTrashCan}/>
        </Button>
        <Button
          className='buttonLink'
          disabled={0 === selectedItems.length}
        >
          Download selected <FontAwesomeIcon icon={faDownload}/></Button>
      </div>
    </>
  );
};

export default SelectedList;

