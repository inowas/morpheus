import React, {useState} from 'react';
import {Dropdown, DropdownItem, DropdownMenu, Search, SearchProps} from 'semantic-ui-react';
import styles from './DropdownWithSearchInput.module.less';

interface ISearchComponentProps {
  dropDownText: string;
  searchPlaceholder?: string;
  onChangeSearch: (search: string) => void;
  dropdownItems: { text: string, action: () => void }[];
  isReadOnly: boolean;
}

const DropdownWithSearchInput = ({onChangeSearch, dropdownItems, dropDownText, searchPlaceholder, isReadOnly}: ISearchComponentProps) => {
  const [value, setValue] = useState('');

  const handleSearchChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, data: SearchProps) => {
    setValue(data.value as string);
    onChangeSearch(data.value as string);
  };

  return (
    <div className={styles.searchWrapper}>
      <Dropdown
        data-testid='test-search-component'
        text={dropDownText}
        icon='plus'
        floating
        labeled
        button
        className='icon'
        disabled={isReadOnly}
      >
        <DropdownMenu>
          {dropdownItems.map((item, key) => (
            <DropdownItem key={key} onClick={item.action}>{item.text}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Search
        icon={false}
        className={styles.search}
        placeholder={searchPlaceholder ? searchPlaceholder : 'Search...'}
        onSearchChange={handleSearchChange}
        value={value}
      />
    </div>
  );
};

export default DropdownWithSearchInput;
