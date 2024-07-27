import React from 'react';
import {Search, SearchProps} from 'semantic-ui-react';
import styles from './SearchInput.module.less';

interface IProps {
  search: string
  placeholder?: string
  onChange: (search: string) => void;
  children?: React.ReactNode;
}

const SearchInput = ({children, search, placeholder, onChange}: IProps) => {

  const handleSearchChange = (_: React.MouseEvent<HTMLElement, MouseEvent>, data: SearchProps) => onChange(data.value as string);

  return (
    <div className={styles.searchWrapper} data-testid="test-search-component">
      {children}
      <Search
        icon={false}
        className={styles.search}
        placeholder={placeholder}
        onSearchChange={handleSearchChange}
        value={search}
      />
    </div>
  );
};

export default SearchInput;
