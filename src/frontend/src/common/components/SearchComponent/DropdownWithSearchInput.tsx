import React, {useState} from 'react';
import {Search, SearchProps} from 'semantic-ui-react';
import styles from './DropdownWithSearchInput.module.less';
import {DropdownComponent} from 'common/components';

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
      <DropdownComponent.Dropdown
        data-testid='test-search-component'
        text={dropDownText}
        icon='plus'
        floating={true}
        labeled={true}
        button={true}
        className='icon'
        disabled={isReadOnly}
      >
        <DropdownComponent.Menu>
          {dropdownItems.map((item, key) => (
            <DropdownComponent.Item key={key} onClick={item.action}>{item.text}</DropdownComponent.Item>
          ))}
        </DropdownComponent.Menu>
      </DropdownComponent.Dropdown>
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
