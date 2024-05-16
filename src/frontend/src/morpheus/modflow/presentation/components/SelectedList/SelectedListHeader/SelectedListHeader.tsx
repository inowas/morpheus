import {Checkbox, HeaderContent, Search} from 'semantic-ui-react';
import React from 'react';
import styles from './SelectedListHeader.module.less';

interface ISelectedListHeaderProps {
  checked: boolean;
  onChange: (e: any, data: any) => void;
  searchQuery: string;
  onSearchChange: (e: any, data: any) => void;
}

const SelectedListHeader = ({
  checked, onChange, searchQuery, onSearchChange,
}: ISelectedListHeaderProps) => {

  return (
    <HeaderContent className={styles.header}>
      <Checkbox
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
      />
      <span>
          Search
      </span>
      <Search
        icon={false}
        onSearchChange={onSearchChange}
        value={searchQuery}
        className={styles.search}
      />
    </HeaderContent>
  );
};

export default SelectedListHeader;

