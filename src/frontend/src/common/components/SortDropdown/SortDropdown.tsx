import './SortDropdown.less';

import {Dropdown, DropdownProps} from 'semantic-ui-react';
import React, {ReactNode, SyntheticEvent} from 'react';

import {IProjectCard} from 'common/components/ModelCard';
import {ISortOption} from 'common/components/SortDropdown';

interface IProps {
  data: IProjectCard[];
  sortOptions: ISortOption[];
  setModelData: (data: IProjectCard[]) => void;
  placeholder: string
  children: ReactNode;
}


const SortDropdown = ({children, sortOptions, data, setModelData, placeholder}: IProps) => {

  const handleSort = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    let sortedData = [...data];
    switch (value) {
    case 'mostRecent':
      sortedData.sort((a, b) => new Date(b.last_updated_at.split('.').reverse().join('-')).getTime() - new Date(a.last_updated_at.split('.').reverse().join('-')).getTime());
      break;
    case 'lessRecent':
      sortedData.sort((a, b) => new Date(a.last_updated_at.split('.').reverse().join('-')).getTime() - new Date(b.last_updated_at.split('.').reverse().join('-')).getTime());
      break;
    case 'aToZ':
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'zToA':
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
    }
    setModelData(sortedData);
  };

  return (
    <div
      data-testid="sort-dropdown-container"
      className="sortDropdownContainer"
    >
      {children}
      <Dropdown
        data-testid="sort-dropdown"
        className="sortDropdown"
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


