import {Accordion, Checkbox, Icon, List, ListItem} from 'semantic-ui-react';
import {Button, Confirm, DotsMenu} from 'common/components';
import React, {useMemo, useState} from 'react';
import styles from './BoundaryList.module.less';
import {IBoundary, IBoundaryId, IBoundaryType, IObservation, IObservationId, ISelectedBoundaryAndObservation} from '../../../../types/Boundaries.type';
import BoundaryListHeader from './BoundaryListHeader';
import {hasMultipleObservations} from '../helpers';

interface ISelectedListProps {
  type: IBoundaryType;
  boundaries: IBoundary[];
  checkedBoundaries: IBoundaryId[];
  selectedBoundaryObservation?: IObservation<any>;
  selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation;
  onChangeCheckedBoundaries: (boundaryIds: IBoundaryId[]) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onCloneObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => Promise<void>;
  onChangeBoundaryName: (boundaryId: IBoundaryId, name: string) => Promise<void>;
  onDisableBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onEnableBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onSelectBoundaryAndObservation: (selectedBoundaryAndObservation: ISelectedBoundaryAndObservation) => void;
  onUpdateObservation: (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => Promise<void>;
  onRemoveBoundaries: (boundaryIds: IBoundaryId[]) => Promise<void>;
  onRemoveObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => Promise<void>;
  isReadOnly: boolean;
}


const BoundaryList = ({
  type,
  boundaries,
  checkedBoundaries,
  selectedBoundaryAndObservation,
  onChangeBoundaryName,
  onSelectBoundaryAndObservation,
  onChangeCheckedBoundaries,
  onCloneBoundary,
  onCloneObservation,
  onDisableBoundary,
  onEnableBoundary,
  onUpdateObservation,
  onRemoveBoundaries,
  onRemoveObservation,
  isReadOnly,
}: ISelectedListProps) => {

  const [search, setSearch] = useState<string>('');

  // Rename boundaries title
  const [editBoundaryName, setEditBoundaryName] = useState<IBoundaryId | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Rename Observations title
  const [openEditingObservationTitle, setOpenEditingObservationTitle] = useState<number | string | null>(null);
  const [inputObservationValue, setInputObservationValue] = useState('');

  // Remove Boundaries Confirm Modal
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);

  const isChecked = (boundary: IBoundary) => checkedBoundaries.includes(boundary.id);
  const isSelected = (boundary: IBoundary) => selectedBoundaryAndObservation?.boundary.id === boundary.id;

  const allBoundariesSelected = 0 < boundaries.length && boundaries.length === checkedBoundaries.length;

  const handleChangeAllSelected = () => {
    if (allBoundariesSelected) {
      return onChangeCheckedBoundaries([selectedBoundaryAndObservation?.boundary.id as IBoundaryId]);
    }

    return onChangeCheckedBoundaries(boundaries.map((b) => b.id));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCheckBoundaryClick = (boundary: IBoundary) => {
    if (isChecked(boundary)) {
      const newCheckedBoundaries = checkedBoundaries.filter((id) => id !== boundary.id);
      if (0 === newCheckedBoundaries.length) {
        onChangeCheckedBoundaries([selectedBoundaryAndObservation?.boundary.id as IBoundaryId]);
      }

      if (boundary.id === selectedBoundaryAndObservation?.boundary.id) {
        const newSelectedBoundary = boundaries.find((b) => b.id === newCheckedBoundaries[0]);
        if (!newSelectedBoundary) {
          return;
        }
        onSelectBoundaryAndObservation({boundary: newSelectedBoundary});
      }

      return onChangeCheckedBoundaries(newCheckedBoundaries);
    }

    return onChangeCheckedBoundaries([...checkedBoundaries, boundary.id]);
  };

  const handleBoundaryListItemClick = (boundary: IBoundary) => {
    onChangeCheckedBoundaries([boundary.id]);
    onSelectBoundaryAndObservation({boundary});
  };

  const filteredBoundaries = useMemo(() => boundaries.filter((b) => b.type === type && b.name.toLowerCase().includes(search.toLowerCase())), [boundaries, search, type]);

  const handleRemoveBoundaries = (boundaryIds: IBoundaryId[]) => {
    onRemoveBoundaries(boundaryIds);

    const newFilteredBoundaries = boundaries.filter((b) => !boundaryIds.includes(b.id));
    if (0 === newFilteredBoundaries.length) {
      return onChangeCheckedBoundaries([]);
    }

    if (newFilteredBoundaries.includes(selectedBoundaryAndObservation?.boundary as IBoundary)) {
      return;
    }

    onSelectBoundaryAndObservation({boundary: newFilteredBoundaries[0]});
  };

  return (
    <>
      {/**/}
      {/*Header with select all checkbox*/}
      {/* for the moment, the select all checkbox is not implemented */}
      {/**/}
      <BoundaryListHeader
        allSelected={allBoundariesSelected}
        onChangeAllSelected={handleChangeAllSelected}
        searchInput={search}
        onChangeSearchInput={handleSearchChange}
      />
      {/**/}
      {/*Body with list items*/}
      {/**/}
      <List className={styles.list}>
        {filteredBoundaries.map((boundary) => (
          <ListItem
            key={boundary.id}
            className={styles.item}
            disabled={!boundary.enabled}
          >
            <div className={`${styles.title} ${(isSelected(boundary) || isChecked(boundary)) ? styles.titleSelected : ''}`}>
              <div className={styles.checkboxBoundaryWrapper}>
                <Checkbox checked={isChecked(boundary)} onChange={(() => handleCheckBoundaryClick(boundary))}/>
              </div>
              {/*// Title open and close observations list*/}
              <div className={`${styles.titleInner}`} onClick={() => handleBoundaryListItemClick(boundary)}>
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
                    <button onClick={async () => {
                      if (!inputValue) {
                        return setEditBoundaryName(null);
                      }
                      await onChangeBoundaryName(boundary.id, inputValue);
                      setInputValue('');
                      setEditBoundaryName(null);
                    }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.buttonsWrapper} style={{paddingRight: `${!boundary.observations[0].observation_name && '21px'}`}}>
                <Checkbox
                  disabled={isReadOnly}
                  toggle={true}
                  checked={boundary.enabled}
                  style={{position: 'relative', pointerEvents: 'all'}}
                  onChange={(_, {checked}) => {
                    if (checked === undefined) {
                      return;
                    }
                    if (boundary.enabled && !checked) {
                      return onDisableBoundary(boundary.id);
                    }

                    if (!boundary.enabled && checked) {
                      return onEnableBoundary(boundary.id);
                    }
                  }}
                />
                <DotsMenu
                  disabled={isReadOnly}
                  className={`${styles.dotsMenu}`}
                  actions={[
                    {
                      text: 'Rename', icon: 'edit', onClick: () => {
                        setEditBoundaryName(boundary.id);
                        setInputValue(boundary.name);
                      },
                    },
                    {text: 'Clone', icon: 'copy', onClick: () => onCloneBoundary(boundary.id)},
                    {text: 'Delete', icon: 'trash', onClick: () => handleRemoveBoundaries([boundary.id])},
                  ]}
                />
                {hasMultipleObservations(boundary.type) && (
                  <Icon
                    name={`${isSelected(boundary) ? 'angle down' : 'angle right'}`}
                    onClick={() => onSelectBoundaryAndObservation({boundary})}
                  />
                )}
              </div>
            </div>
            {hasMultipleObservations(boundary.type) && (
              <Accordion.Content
                className={styles.accordionContent}
                active={isSelected(boundary)}
                style={{display: isSelected(boundary) ? 'block' : 'none'}}
              >
                <List className={styles.listObservations}>
                  {boundary.observations.map((observation) => (
                    <ListItem
                      key={observation.observation_id}
                      onClick={() => onSelectBoundaryAndObservation({boundary, observationId: observation.observation_id})}
                    >
                      <div className={`${styles.observationItem} ${selectedBoundaryAndObservation?.observationId === observation.observation_id ? styles.selected : ''} `}>
                        <span>
                          <Checkbox
                            className={styles.checkboxObservation}
                            checked={selectedBoundaryAndObservation?.observationId === observation.observation_id}
                          />
                          {openEditingObservationTitle !== observation.observation_id && <div style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textShadow: selectedBoundaryAndObservation?.observationId === observation.observation_id ? '0 0 1px rgba(0, 0, 0, 0.7)' : '',
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
                            <button
                              onClick={async () => {
                                if (!inputObservationValue) {
                                  setOpenEditingObservationTitle(null);
                                  return;
                                }
                                await onUpdateObservation(boundary.id, boundary.type, {...observation, observation_name: inputObservationValue});
                                setInputObservationValue('');
                                setOpenEditingObservationTitle(null);
                              }}
                            >
                              Save
                            </button>
                          </div>
                        )}
                        <DotsMenu
                          className={`${styles.dotsMenu}`}
                          disabled={openEditingObservationTitle === observation.observation_id}
                          actions={[
                            {
                              text: 'Rename', icon: 'edit', onClick: () => {
                                setOpenEditingObservationTitle(observation.observation_id);
                                setInputObservationValue(observation.observation_name);
                              },
                            },
                            {text: 'Clone', icon: 'copy', onClick: () => onCloneObservation(boundary.id, observation.observation_id)},
                            {text: 'Delete', icon: 'trash', onClick: () => onRemoveObservation(boundary.id, observation.observation_id)},
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
      <Button
        size={'tiny'}
        icon={'trash'}
        content={'Remove selected'}
        secondary={true}
        disabled={isReadOnly}
        onClick={() => setIsOpenConfirmModal(true)}
        color={'red'}
      />
      <Confirm
        dimmer={'blurring'}
        open={isOpenConfirmModal}
        onConfirm={() => {
          handleRemoveBoundaries(checkedBoundaries);
          setIsOpenConfirmModal(false);
        }}
        onCancel={() => setIsOpenConfirmModal(false)}
        content={`Delete ${checkedBoundaries.length} selected boundaries?`}
      />
    </>
  );
};

export default BoundaryList;
