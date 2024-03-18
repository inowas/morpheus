import './SortDropdown.less';

import {Dropdown, DropdownProps} from 'semantic-ui-react';
import React, {SyntheticEvent} from 'react';

import {IProjectCard} from 'common/components/ModelCard';
import {ISortOption} from 'common/components/SortDropdown';

interface IProps {
  data: IProjectCard[];
  sortOptions: ISortOption[];
  setModelData: (data: IProjectCard[]) => void;
  placeholder: string
  style?: React.CSSProperties;
  className?: string;
}


const SortDropdown = ({sortOptions, data, setModelData, placeholder, style, className}: IProps) => {

  const handleSort = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    let sortedData = [...data];
    switch (value) {
    case 'mostRecent':
      sortedData.sort((a, b) => new Date(b.meta_text.split('.').reverse().join('-')).getTime() - new Date(a.meta_text.split('.').reverse().join('-')).getTime());
      break;
    case 'lessRecent':
      sortedData.sort((a, b) => new Date(a.meta_text.split('.').reverse().join('-')).getTime() - new Date(b.meta_text.split('.').reverse().join('-')).getTime());
      break;
    case 'aToZ':
      sortedData.sort((a, b) => a.model_title.localeCompare(b.model_title));
      break;
    case 'zToA':
      sortedData.sort((a, b) => b.model_title.localeCompare(a.model_title));
      break;
    default:
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


