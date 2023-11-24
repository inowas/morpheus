import React, {ReactNode, SyntheticEvent} from 'react';
import {Dropdown, DropdownProps} from 'semantic-ui-react';
import './SortDropdown.less';
import {IModelCard} from 'components/ModelCard';
import {ISortOption} from 'components/SortDropdown';


interface IProps {
  data: IModelCard[];
  sortOptions: ISortOption[];
  setModelData: (data: IModelCard[]) => void;
  placeholder: string
  children: ReactNode;
}


const SortDropdown = ({children, sortOptions, data, setModelData, placeholder}: IProps) => {

  const handleSort = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    let sortedData = [...data];
    switch (value) {
    case 'author':
      sortedData.sort((a, b) => a.meta_author_name.localeCompare(b.meta_author_name));
      break;
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


