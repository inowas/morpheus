import {Checkbox, List, ListItem} from 'semantic-ui-react';
import {DotsMenu} from 'common/components';
import React, {useMemo, useState} from 'react';
import styles from './ObservationsList.module.less';
import {IHeadObservation, IObservationId} from '../../../../types/HeadObservations.type';

interface ISelectedListProps {
  observations: IHeadObservation[]
  selected: IHeadObservation | null;
  onClone: (observationId: IObservationId) => Promise<void>;
  onDisable: (observationId: IObservationId) => Promise<void>;
  onEnable: (observationId: IObservationId) => Promise<void>;
  onSelect: (observationId: IObservationId) => void;
  onChange: (observation: IHeadObservation) => void;
  onRemove: (observationId: IObservationId) => Promise<void>;
  isReadOnly: boolean;
}


const ObservationsList = ({
  observations,
  selected,
  onClone,
  onDisable,
  onEnable,
  onSelect,
  onChange,
  onRemove,
  isReadOnly,
}: ISelectedListProps) => {

  const [search, setSearch] = useState<string>('');

  // Rename boundaries title
  const [editObservationName, setEditObservationName] = useState<IObservationId | null>(null);
  const [inputValue, setInputValue] = useState('');

  const isSelected = (observation: IHeadObservation) => selected?.id === observation.id;

  const filteredObservations = useMemo(() => {
    return observations.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
  }, [observations, search]);

  return (
    <>
      {/**/}
      {/*Body with list items*/}
      {/**/}
      <List className={styles.list}>
        {filteredObservations.map((observation) => (
          <ListItem
            key={observation.id} className={styles.item}
            disabled={!observation.enabled}
          >
            <div
              // Title styles when item is selected
              className={`${styles.title} ${isSelected(observation) ? styles.titleSelected : ''}`}
            >
              {/*// Title open and close observations list*/}
              <div className={`${styles.titleInner}`} onClick={() => onSelect(observation.id)}>
                {editObservationName !== observation.id &&
                  <div
                    style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
                    onDoubleClick={() => {
                      if (isReadOnly) {
                        return;
                      }
                      setEditObservationName(observation.id);
                      setInputValue(observation.name);
                    }}
                  >
                    {observation.name}
                  </div>}
                {editObservationName === observation.id && (
                  <div className={styles.renameField}>
                    <input
                      type='text'
                      value={inputValue}
                      placeholder={observation.name}
                      onChange={(e) => {
                        const newTitle = e.target.value.trim();
                        if (8 < newTitle.length) {
                          return;
                        }
                        setInputValue(newTitle);
                      }}
                      onBlur={async () => {
                        if (isReadOnly) {
                          return;
                        }
                        const sanitizedValue = inputValue
                          .trim()
                          .replace(/\s+/g, '_')
                          .replace(/[^a-zA-Z0-9._-]/g, '');

                        if (!sanitizedValue) {
                          return setEditObservationName(null);
                        }
                        await onChange({...observation, name: sanitizedValue});
                        setInputValue('');
                        setEditObservationName(null);
                      }}
                    />
                    <button onClick={async () => {
                      if (!inputValue) {
                        return setEditObservationName(null);
                      }
                      await onChange({...observation, name: inputValue});
                      setInputValue('');
                      setEditObservationName(null);
                    }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.buttonsWrapper} style={{paddingRight: '21px'}}>
                <Checkbox
                  disabled={isReadOnly}
                  toggle={true}
                  checked={observation.enabled}
                  style={{position: 'relative', pointerEvents: 'all'}}
                  onChange={(_, {checked}) => {
                    if (checked === undefined) {
                      return;
                    }
                    if (observation.enabled && !checked) {
                      return onDisable(observation.id);
                    }

                    if (!observation.enabled && checked) {
                      return onEnable(observation.id);
                    }
                  }}
                />
                <DotsMenu
                  disabled={isReadOnly}
                  className={`${styles.dotsMenu}`}
                  actions={[
                    {
                      text: 'Rename', icon: 'edit', onClick: () => {
                        setEditObservationName(observation.id);
                        setInputValue(observation.name);
                      },
                    },
                    {text: 'Clone', icon: 'copy', onClick: () => onClone(observation.id)},
                    {text: 'Delete', icon: 'remove', onClick: () => onRemove(observation.id)},
                  ]}
                />
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ObservationsList;
