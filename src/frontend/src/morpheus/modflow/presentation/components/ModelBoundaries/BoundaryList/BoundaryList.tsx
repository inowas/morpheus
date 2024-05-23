import {Accordion, Checkbox, Icon, List, ListItem} from 'semantic-ui-react';
import {Button, DotsMenu} from 'common/components';
import React, {useEffect, useState} from 'react';
import styles from './BoundaryList.module.less';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IBoundary, IBoundaryId, IBoundaryType, IObservationId} from "../../../../types/Boundaries.type";
import BoundaryListHeader from "./BoundaryListHeader";

interface ISelectedObservation {
  boundaryId: IBoundaryId;
  observationId: IObservationId;
}

interface ISelectedListProps {
  type: IBoundaryType;
  boundaries: IBoundary[];
  canManageObservations: boolean;
  selectedBoundaries: IBoundaryId[];
  onChangeSelectedBoundaries: (id: IBoundaryId[]) => void;

  selectedObservation: ISelectedObservation | null;
  onChangeSelectedObservation: (data: ISelectedObservation | null) => void;

  onRename: (id: string, name: string, observationsId?: string) => void;
  onRemoveBoundaries: (ids: IBoundaryId[]) => void;
  onDelete: (id: string, observationsId?: string) => void;
  onClone: (id: string, observationsId?: string) => void;
}

const findObservationIds = (id: string, data: IBoundary[]) => {
  const foundObject = data.find(obj => obj.id === id);
  if (foundObject && foundObject.observations) {
    return foundObject.observations.map(obs => obs.observation_id);
  }

  return [];
};

const BoundaryList = ({
                        type,
                        boundaries,
                        canManageObservations,
                        selectedBoundaries,
                        selectedObservation,
                        onChangeSelectedBoundaries,
                        onChangeSelectedObservation,
                        onRename,
                        onDelete,
                        onRemoveBoundaries,
                        onClone
                      }: ISelectedListProps) => {

  const [search, setSearch] = useState<string>('')
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activePanels, setActivePanels] = useState<number[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // Rename boundaries title
  const [editBoundaryName, setEditBoundaryName] = useState<IBoundaryId | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Rename Observations title
  const [openEditingObservationTitle, setOpenEditingObservationTitle] = useState<number | string | null>(null);
  const [inputObservationValue, setInputObservationValue] = useState('');

  // selectAll functionality
  useEffect(() => {
    if (!selectAllChecked) {
      return onChangeSelectedBoundaries([])
    }

    return onChangeSelectedBoundaries(boundaries.map(boundary => boundary.id));
  }, [selectAllChecked]);

  const handleItemSelect = (itemId: string, metaPressed: boolean) => {
    let updatedSelection: string[];
    let observationIds = findObservationIds(itemId, boundaries);
    if (metaPressed) {
      if (selectedBoundaries.includes(itemId)) {
        updatedSelection = selectedBoundaries.filter(item => item !== itemId);
      } else {
        updatedSelection = [...selectedBoundaries, itemId];
      }
    } else {
      updatedSelection = [itemId];
    }
    setSelectAllChecked(false);
    onChangeSelectedBoundaries(updatedSelection);
  };

  const handleObservationSelect = (boundaryId: IBoundaryId, observationId: IObservationId) => {
    onChangeSelectedObservation({boundaryId, observationId})
  };

  const handleItemDisabled = (itemId: string, index: number) => {
    let observationIds = findObservationIds(itemId, boundaries);
    if (selectedBoundaries.includes(itemId)) {
      let updatedSelection = selectedBoundaries.filter(item => item !== itemId);
      onChangeSelectedBoundaries(updatedSelection);

      onChangeSelectedObservation(null)
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

  const handleDeleteSelected = () => {
    onRemoveBoundaries(selectedBoundaries)
    setSelectAllChecked(false)
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
      <BoundaryListHeader
        allSelected={0 === boundaries.length ? false : selectAllChecked}
        onChangeAllSelected={() => setSelectAllChecked(prev => !prev)}
        searchInput={searchQuery}
        onChangeSearchInput={setSearch}
      />
      {/**/}
      {/*Body with list items*/}
      {/**/}
      <List className={styles.list}>
        {boundaries.map((boundary, idx) => (
          <ListItem
            key={boundary.id}
            className={styles.item}
          >
            <div
              // Title styles when item is selected
              className={`${styles.title} ${selectedBoundaries.includes(boundary.id) ? styles.titleSelected : ''}`}
            >
              <div
                className={`${styles.titleInner} ${checkedItems.includes(boundary.id) ? styles.disabled : ''}`}
                onClick={(e) => handleItemSelect(boundary.id, e.metaKey)}
              >
                <Checkbox checked={selectedBoundaries.includes(boundary.id)}/>
                {editBoundaryName !== boundary.id && <div style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                  {boundary.name}
                </div>}

                {editBoundaryName === boundary.id && (
                  <div className={styles.renameField}>
                    <input
                      type='text'
                      value={inputValue}
                      placeholder={boundary.name}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setInputValue(newTitle);
                      }}
                    />
                    <button onClick={() => {
                      if (!inputValue) {
                        setEditBoundaryName(null);
                        return;
                      }
                      onRename(boundary.id, inputValue);
                      setInputValue('');
                      setEditBoundaryName(null);
                    }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
              <div
                className={styles.buttonsWrapper}
                style={{paddingRight: `${!boundary.observations[0].observation_name && '21px'}`}}
              >
                <Checkbox
                  disabled={editBoundaryName === boundary.id}
                  toggle={true}
                  checked={!checkedItems.includes(boundary.id)}
                  onChange={() => handleItemDisabled(boundary.id, idx)}
                />
                <DotsMenu
                  disabled={editBoundaryName === boundary.id}
                  className={`${styles.dotsMenu} ${checkedItems.includes(boundary.id) ? styles.disabled : ''}`}
                  actions={[
                    {text: 'Rename Item', icon: 'edit', onClick: () => setEditBoundaryName(boundary.id)},
                    {text: 'Copy', icon: 'copy', onClick: () => onClone(boundary.id)},
                    {text: 'Delete', icon: 'remove', onClick: () => onDelete(boundary.id)},
                  ]}
                />

                {canManageObservations && (
                  <Icon
                    className={`${checkedItems.includes(boundary.id) ? styles.disabled : ''}`}
                    name={`${activePanels.includes(idx) ? 'angle down' : 'angle right'}`}
                    onClick={() => toggleAccordion(idx)}
                  />
                )}
              </div>
            </div>

            {canManageObservations && (
              <Accordion.Content
                className={styles.accordionContent}
                active={activePanels.includes(idx)}
                style={{display: activePanels.includes(idx) ? 'block' : 'none'}}
              >
                <List className={styles.listObservations}>
                  {boundary.observations.map((observation) => (
                    <ListItem
                      key={observation.observation_id}
                      onClick={() => handleObservationSelect(boundary.id, observation.observation_id)}
                    >
                      <div className={styles.observationItem}>
                          <span>
                            <Checkbox
                              className={styles.checkboxObservation}
                              checked={selectedObservation?.observationId === observation.observation_id}
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
                              onRename(boundary.id, inputObservationValue, observation.observation_id);
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
                            {text: 'Copy', icon: 'copy', onClick: () => onClone(boundary.id, observation.observation_id)},
                            {text: 'Delete', icon: 'remove', onClick: () => onDelete(boundary.id, observation.observation_id)},
                          ]}
                        />
                      </div>
                    </ListItem>
                  ))}
                </List>
              </Accordion.Content>
            )}
          </ListItem>
        ))}
      </List>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
        <Button
          className='buttonLink'
          disabled={0 === selectedBoundaries.length}
          onClick={handleDeleteSelected}
        >
          Delete selected <FontAwesomeIcon icon={faTrashCan}/>
        </Button>
        <Button
          className='buttonLink'
          disabled={0 === selectedBoundaries.length}
        >
          Download selected <FontAwesomeIcon icon={faDownload}/></Button>
      </div>
    </>
  );
};

export default BoundaryList;

