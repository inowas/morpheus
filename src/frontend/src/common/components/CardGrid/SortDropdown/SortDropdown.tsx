import './SortDropdown.less';

import {DropdownProps} from 'semantic-ui-react';
import React, {SyntheticEvent} from 'react';
import {DropdownComponent} from 'common/components';

interface IProps<T> {
  sortOptions: T[];
  onChangeSortOption: (value: T) => void;
  placeholder: string
  style?: React.CSSProperties;
  className?: string;
}


const SortDropdown = <T extends { value: string, text: string }>({sortOptions, onChangeSortOption, placeholder, style, className}: IProps<T>) => {

  const handleSortOptionChange = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const sortOption = sortOptions.find((option) => option.value === data.value);
    if (sortOption) {
      onChangeSortOption(sortOption);
    }
  };

  return (
    <div
      data-testid="sort-dropdown-container"
      className={`sortDropdownContainer ${className ? className : ''}`}
      style={style}
    >
      <DropdownComponent.Dropdown
        data-testid="sort-dropdown"
        className='sortDropdown'
        selection={true}
        icon="sort amount up"
        placeholder={placeholder}
        options={sortOptions}
        onChange={handleSortOptionChange}
      />
    </div>
  );
};

export default SortDropdown;
