import {Accordion, Checkbox, HeaderContent, Icon, List, ListItem, Search} from 'semantic-ui-react';
import {DotsMenu} from 'common/components';
import React, {useEffect, useState} from 'react';
import {IBoundaries} from '../BoundariesLayers/type/BoundariesContent.type';
import styles from './SelectedList.module.less';


interface ISelectedListProps {
  boundaries: IBoundaries[];
  onSelect: (id: string[]) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
}

const SelectedList = ({boundaries, onDelete, onCopy, onSelect}: ISelectedListProps) => {
  const [listItems, setListItems] = useState<IBoundaries[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePanels, setActivePanels] = useState<number[]>([]);
  // List items with checked checkbox
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  // List items which are selected manually
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    setListItems(boundaries);
  }, [boundaries]);

  useEffect(() => {
    onSelect(selectedItems);
  }, [selectedItems]);

  // selectAll functionality
  useEffect(() => {
    if (selectAllChecked) {
      const selectedWithoutChecked = listItems
        .filter(item => !checkedItems.includes(item.id))
        .map(item => item.id);
      setSelectedItems(selectedWithoutChecked);
    } else {
      setSelectedItems([]);
    }
  }, [selectAllChecked, listItems, checkedItems]);

  const handleItemClick = (itemId: string, metaPressed: boolean) => {
    let updatedSelection: string[];
    if (metaPressed) {
      if (selectedItems.includes(itemId)) {
        updatedSelection = selectedItems.filter(item => item !== itemId);
      } else {
        updatedSelection = [...selectedItems, itemId];
      }
    } else {
      updatedSelection = [itemId];
    }
    setSelectAllChecked(false);
    setSelectedItems(updatedSelection);
  };

  const handleCheckboxChange = (itemId: string, index: number) => {
    setCheckedItems(prevSelected => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter(item => item !== itemId);
      } else {
        return [...prevSelected, itemId];
      }

    });
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(item => item !== itemId));
    }
    if (activePanels.includes(index)) {
      setActivePanels(activePanels.filter(item => item !== index));
    }
  };

  const handleSearchChange = (event: React.MouseEvent<HTMLElement>, data: any) => {
    const query = data.value.toLowerCase();
    setSearchQuery(query);
    const filteredItems = boundaries.filter(item =>
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
      <HeaderContent className={styles.header}>
        <Checkbox
          className={styles.checkbox}
          checked={selectAllChecked}
          onChange={() => setSelectAllChecked(prev => !prev)}
        />
        <span>
          Search
        </span>
        <Search
          icon={false}
          onSearchChange={handleSearchChange}
          value={searchQuery}
          className={styles.search}
        />
      </HeaderContent>
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
                onClick={(e) => handleItemClick(item.id, e.metaKey)}
              >
                <Checkbox
                  checked={selectedItems.includes(item.id)}
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
                  checked={!checkedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id, index)}
                />
                <DotsMenu
                  className={`${styles.dotsMenu} ${checkedItems.includes(item.id) ? styles.disabled : ''}`}
                  actions={[
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
