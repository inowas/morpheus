import './SortDropdown.less';

import {Dropdown, DropdownProps} from 'semantic-ui-react';
import React, {SyntheticEvent} from 'react';

import {ICard} from '../Card';
import {ISortOption} from '../SortDropdown';

interface IProps {
  data: ICard[];
  sortOptions: ISortOption[];
  setModelData: (data: ICard[]) => void;
  placeholder: string
  style?: React.CSSProperties;
  className?: string;
}


const SortDropdown = ({sortOptions, data, setModelData, placeholder, style, className}: IProps) => {

  const handleSort = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {


    let sortedData = [...data];
    
    switch (value) {
    case 'mostRecent':
      sortedData.sort((a, b) => new Date(b.date_time.split('.').reverse().join('-')).getTime() - new Date(a.date_time.split('.').reverse().join('-')).getTime());
      break;
    case 'lessRecent':
      sortedData.sort((a, b) => new Date(a.date_time.split('.').reverse().join('-')).getTime() - new Date(b.date_time.split('.').reverse().join('-')).getTime());
      break;
    case 'aToZ':
      sortedData.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'zToA':
      sortedData.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      console.log('default');
      break;
    }
    setModelData(sortedData);
  };

  return (
    <div
      data-testid="sort-dropdown-container"
      className={`sortDropdownContainer ${className ? className : ''}`}
      style={style}
    >
      <Dropdown
        data-testid="sort-dropdown"
        className='sortDropdown'
        selection={true}
        icon="sort amount up"
        placeholder={placeholder}
        options={sortOptions}
        onChange={handleSort}
      />
    </div>


  );
};

export default SortDropdown;


