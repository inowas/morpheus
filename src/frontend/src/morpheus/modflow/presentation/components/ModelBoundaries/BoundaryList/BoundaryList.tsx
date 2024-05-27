import {Accordion, Checkbox, Icon, List, ListItem} from 'semantic-ui-react';
import {DotsMenu} from 'common/components';
import React, {useMemo, useState} from 'react';
import styles from './BoundaryList.module.less';
import {IBoundary, IBoundaryId, IBoundaryType, IObservation, IObservationId} from "../../../../types/Boundaries.type";
import BoundaryListHeader from "./BoundaryListHeader";
import {ISelectedBoundary} from "../types/SelectedBoundary.type";
import {canHaveMultipleObservations} from "../helpers";

interface ISelectedListProps {
  type: IBoundaryType;
  boundaries: IBoundary[];
  selectedBoundary: ISelectedBoundary;
  onSelectBoundary: (selectedBoundary: ISelectedBoundary) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => void;
  onCloneObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => void;
  onUpdateBoundary: (boundary: IBoundary) => void;
  onUpdateObservation: (boundaryId: IBoundaryId, observationId: IObservationId, observation: IObservation<any>) => void;
  onRemoveBoundary: (boundaryId: IBoundaryId) => void;
  onRemoveObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => void;
  isReadOnly: boolean;
}

const BoundaryList = ({
                        type,
                        boundaries,
                        selectedBoundary,
                        onSelectBoundary,
                        onCloneBoundary,
                        onCloneObservation,
                        onUpdateBoundary,
                        onUpdateObservation,
                        onRemoveBoundary,
                        onRemoveObservation,
                        isReadOnly
                      }: ISelectedListProps) => {

  const [search, setSearch] = useState<string>('');

  // Rename boundaries title
  const [editBoundaryName, setEditBoundaryName] = useState<IBoundaryId | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Rename Observations title
  const [openEditingObservationTitle, setOpenEditingObservationTitle] = useState<number | string | null>(null);
  const [inputObservationValue, setInputObservationValue] = useState('');

  const handleSelectBoundary = (boundary: IBoundary) => onSelectBoundary({boundary, observationId: boundary.observations[0].observation_id});
  const handleSelectObservation = (boundary: IBoundary, observationId: IObservationId) => onSelectBoundary({boundary, observationId});

  const filteredBoundaries = useMemo(() => {
    return boundaries.filter((b) => b.type === type && b.name.toLowerCase().includes(search.toLowerCase()));
  }, [boundaries, search, type]);

  const isSelected = (boundary: IBoundary) => selectedBoundary.boundary.id === boundary.id;

  return (
    <>
      {/**/}
      {/*Header with select all checkbox*/}
      {/* for the moment, the select all checkbox is not implemented */}
      {/**/}
      <BoundaryListHeader
        allSelected={undefined}
        onChangeAllSelected={undefined}
        searchInput={search}
        onChangeSearchInput={setSearch}
      />
      {/**/}
      {/*Body with list items*/}
      {/**/}
      <List className={styles.list}>
        {filteredBoundaries.map((boundary) => (
          <ListItem key={boundary.id} className={styles.item}>
            <div
              // Title styles when item is selected
              className={`${styles.title} ${isSelected(boundary) ? styles.titleSelected : ''}`}
            >
              <div className={`${styles.titleInner}`} onClick={() => handleSelectBoundary(boundary)}>
                {editBoundaryName !== boundary.id &&
                  <div style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
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
                      onUpdateBoundary({...boundary, name: inputValue});
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
                <DotsMenu
                  disabled={isReadOnly}
                  className={`${styles.dotsMenu}`}
                  actions={[
                    {text: 'Rename Item', icon: 'edit', onClick: () => setEditBoundaryName(boundary.id)},
                    {text: 'Copy', icon: 'copy', onClick: () => onCloneBoundary(boundary.id)},
                    {text: 'Delete', icon: 'remove', onClick: () => onRemoveBoundary(boundary.id)},
                  ]}
                />

                {canHaveMultipleObservations(boundary) && (
                  <Icon
                    name={`${isSelected(boundary) ? 'angle down' : 'angle right'}`}
                    onClick={() => handleSelectBoundary(boundary)}
                  />
                )}
              </div>
            </div>

            {canHaveMultipleObservations(boundary) && (
              <Accordion.Content
                className={styles.accordionContent}
                active={isSelected(boundary)}
                style={{display: isSelected(boundary) ? 'block' : 'none'}}
              >
                <List className={styles.listObservations}>
                  {boundary.observations.map((observation) => (
                    <ListItem
                      key={observation.observation_id}
                      onClick={() => handleSelectObservation(boundary, observation.observation_id)}
                    >
                      <div className={`${styles.observationItem} ${selectedBoundary.observationId === observation.observation_id ? styles.selected : ''} `}>
                          <span>
                            <Checkbox
                              className={styles.checkboxObservation}
                              checked={selectedBoundary.observationId === observation.observation_id}
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
                              onUpdateObservation(boundary.id, observation.observation_id, {...observation, observation_name: inputObservationValue});
                              setInputObservationValue('');
                              setOpenEditingObservationTitle(null);
                            }}
                            >
                              Apply
                            </button>
                          </div>
                        )}
                        <DotsMenu
                          className={`${styles.dotsMenu}`}
                          disabled={openEditingObservationTitle === observation.observation_id}
                          actions={[
                            {
                              text: 'Rename Item',
                              icon: 'edit',
                              onClick: () => setOpenEditingObservationTitle(observation.observation_id),
                            },
                            {
                              text: 'Clone',
                              icon: 'copy',
                              onClick: () => onCloneObservation(boundary.id, observation.observation_id),
                            },
                            {
                              text: 'Delete',
                              icon: 'remove',
                              onClick: () => onRemoveObservation(boundary.id, observation.observation_id),
                            },
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
      {/*<div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>*/}
      {/*  <Button*/}
      {/*    className='buttonLink'*/}
      {/*    disabled={0 === checkedBoundaries.length}*/}
      {/*    onClick={handleDeleteSelected}*/}
      {/*  >*/}
      {/*    Delete selected <FontAwesomeIcon icon={faTrashCan}/>*/}
      {/*  </Button>*/}
      {/*  <Button*/}
      {/*    className='buttonLink'*/}
      {/*    disabled={0 === checkedBoundaries.length}*/}
      {/*  >*/}
      {/*    Download selected <FontAwesomeIcon icon={faDownload}/></Button>*/}
      {/*</div>*/}
    </>
  );
};

export default BoundaryList;
