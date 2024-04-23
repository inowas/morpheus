import {Checkbox, List, ListItem, Search} from 'semantic-ui-react';
import {DotsMenu, Label} from 'common/components';
import React, {useEffect, useState} from 'react';
import styles from './SelectedList.module.less';

interface ISelectedItem {
  id: string;
  name: string;
  sub_layers?: string[];
}

interface ISelectedListProps {
  boundary?: any;
  items: ISelectedItem[];
}

const SelectedList = ({items, boundary}: ISelectedListProps) => {
  const [listItems, setListItems] = useState<ISelectedItem[]>(items);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  console.log(boundary);
  useEffect(() => {
    setListItems(items);
  }, [items]);

  useEffect(() => {
    if (selectAllChecked) {
      const allItemIds = listItems.map(item => item.id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  }, [selectAllChecked, listItems]);

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

  const handleCheckboxChange = (name: string) => {
    setCheckedItems(prevSelected => {
      if (prevSelected.includes(name)) {
        return prevSelected.filter(itemName => itemName !== name);
      } else {
        return [...prevSelected, name];
      }
    });
  };

  const handleDelete = (value: string) => {
    const updatedItemList = listItems.filter(item => item.name !== value);
    const updatedSelectedItems = checkedItems.filter(itemName => itemName !== value);
    setListItems(updatedItemList);
    setCheckedItems(updatedSelectedItems);
  };

  const handleSearchChange = (event: React.MouseEvent<HTMLElement>, data: any) => {
    const query = data.value.toLowerCase();
    setSearchQuery(query);
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(query),
    );
    setListItems(filteredItems);
  };

  return (
    <>
      {/**/}
      {/*Header with select all checkbox*/}
      {/**/}
      <Checkbox
        className={styles.checkbox}
        checked={selectAllChecked}
        onChange={() => setSelectAllChecked(prev => !prev)}
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
        {0 < listItems.length && listItems.map(item => (
          <ListItem
            key={item.id}
            className={styles.listItem}
          >
            <div
              className={styles.listItemContent}
              style={{
                backgroundColor: selectedItems.includes(item.id) ? 'lightblue' : 'white',
                cursor: 'pointer',
              }}
              onClick={(e) => handleItemClick(item.id, e.metaKey)}
            >
              <Checkbox
                className={styles.checkbox}
                checked={selectedItems.includes(item.id)}
                onChange={() => handleItemClick(item.id, true)}
              />
              <Label>{item.name}
                <Checkbox
                  toggle={true}
                  checked={checkedItems.includes(item.name)}
                  onChange={() => handleCheckboxChange(item.name)}
                />
              </Label>
              <DotsMenu
                className={styles.dotsMenu}
                actions={[
                  {text: 'Delete', icon: 'remove', onClick: () => handleDelete(item.name)},
                ]}
              />
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SelectedList;
