import {Checkbox, HeaderContent, Search} from 'semantic-ui-react';
import React from 'react';
import styles from './BoundaryListHeader.module.less';

interface ISelectedListHeaderProps {
  allSelected: boolean;
  onChangeAllSelected: (e: any, data: any) => void;
  searchInput: string;
  onChangeSearchInput: (e: any, data: any) => void;
}

const BoundaryListHeader = ({allSelected, onChangeAllSelected, searchInput, onChangeSearchInput}: ISelectedListHeaderProps) => (
  <HeaderContent className={styles.header}>
    <Checkbox
      className={styles.checkbox}
      checked={allSelected}
      onChange={onChangeAllSelected}
    />
    <span>
          Search
      </span>
    <Search
      icon={false}
      onSearchChange={onChangeSearchInput}
      value={searchInput}
      className={styles.search}
    />
  </HeaderContent>
);

export default BoundaryListHeader;
