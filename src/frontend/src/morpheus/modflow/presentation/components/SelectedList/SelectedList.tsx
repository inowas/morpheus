import {Accordion, Checkbox, Icon, List, ListItem, Search} from 'semantic-ui-react';
import {DotsMenu} from 'common/components';
import React, {useEffect, useState} from 'react';
import styles from './SelectedList.module.less';

interface IBoundaryItem {
  id: string;
  name: string;
  observations: any[];
  checked: boolean,
  selected: boolean,
}

interface ISelectedListProps {
  boundaries: any[];
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
}

const SelectedList = ({boundaries, onDelete, onCopy}: ISelectedListProps) => {
  const [listItems, setListItems] = useState<IBoundaryItem[]>([]);
  const [filterdListItems, setFilterdListItems] = useState<IBoundaryItem[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePanels, setActivePanels] = useState<number[]>([]);

  useEffect(() => {
    const boundariesListObj = boundaries.map(boundaryItem => ({
      id: boundaryItem.id,
      name: boundaryItem.name,
      observations: boundaryItem.observations,
      checked: true,
      selected: false,
    }));
    setListItems(boundariesListObj);
  }, [boundaries]);

  const handleSelectAllChange = () => {
    setSelectAllChecked(prev => !prev);
    setListItems(prevListItems => prevListItems.map(item => ({
      ...item,
      selected: !item.checked ? false : !item.selected,
    })));
  };

  const handleItemClick = (itemId: string, metaPressed: boolean) => {
    const updatedListItems = listItems.map(item => {
      if (item.id === itemId) {
        if (metaPressed) {
          // Toggle the selected state if meta key is pressed
          return {
            ...item,
            selected: !item.selected,
          };
        } else {
          // Deselect all other items and select only the clicked item
          return {
            ...item,
            selected: true,
          };
        }
      } else {
        if (!metaPressed) {
          // Deselect other items if meta key is not pressed
          return {
            ...item,
            selected: false,
          };
        }
        // Keep other items unchanged if meta key is pressed
        return item;
      }
    });

    setSelectAllChecked(false);
    setListItems(updatedListItems);
  };

  const handleCheckboxChange = (id: string, index: number) => {
    const updatedListItems = listItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          selected: false,
          checked: !item.checked,
        };
      }
      return item;
    });
    if (activePanels.includes(index)) {
      setActivePanels(activePanels.filter(item => item !== index));
    }
    setListItems(updatedListItems);
  };

  const handleSearchChange = (event: React.MouseEvent<HTMLElement>, data: any) => {
    setFilterdListItems(listItems);
    const query = data.value.toLowerCase();
    setSearchQuery(query);
    const filteredItems = filterdListItems.filter(item =>
      item.name.toLowerCase().includes(query),
    );
    setListItems(filteredItems);
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
      <Checkbox
        className={styles.checkbox}
        checked={selectAllChecked}
        onChange={handleSelectAllChange}
      />
      <Search
        onSearchChange={handleSearchChange}
        value={searchQuery}
        className={styles.search}
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
              className={`${styles.title} ${item.selected ? styles.titleSelected : ''}`}
            >
              <div
                className={`${styles.titleInner} ${!item.checked ? styles.disabled : ''}`}
                onClick={(e) => handleItemClick(item.id, e.metaKey)}
              >
                <Checkbox
                  checked={item.selected}
                  onChange={() => handleItemClick(item.id, true)}
                />
                <div style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
                >
                  {item.name}
                </div>

              </div>
              <div
                className={styles.buttonsWrapper}
                style={{paddingRight: `${!item.observations[0].observation_name && '21px'}`}}
              >
                <Checkbox
                  toggle={true}
                  checked={item.checked}
                  onChange={() => handleCheckboxChange(item.id, index)}
                />
                <DotsMenu
                  className={`${styles.dotsMenu} ${!item.checked ? styles.disabled : ''}`}
                  actions={[
                    {text: 'Copy', icon: 'copy', onClick: () => onCopy(item.id)},
                    {text: 'Delete', icon: 'remove', onClick: () => onDelete(item.id)},
                  ]}
                />
                {item.observations[0].observation_name && (
                  <Icon
                    className={`${!item.checked ? styles.disabled : ''}`}
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
                <List>
                  {item.observations.map((observation) => {
                    return (
                      <ListItem
                        key={observation.observation_id}
                      >
                        <Icon name="circle" style={{color: '#748EB3', marginRight: '5px'}}/>
                        {observation.observation_name}
                      </ListItem>
                    );
                  })}
                </List>

              </Accordion.Content>
            )}

          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SelectedList;
