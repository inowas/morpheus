import {Dropdown as SemanticDropdown, DropdownProps} from 'semantic-ui-react';

import {DropdownItemProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import {DropdownOnSearchChangeData} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import {LabelProps} from 'semantic-ui-react/dist/commonjs/elements/Label';
import React, {useState} from 'react';
import styles from './TechInput.module.less';


interface IOption {
  key: string;
  text: string;
  value: string;
}

export interface IDropdownProps {
  name?: string
  as?: any
  additionLabel?: number | string | React.ReactNode
  additionPosition?: 'top' | 'bottom'
  allowAdditions?: boolean
  basic?: boolean
  button?: boolean
  children?: React.ReactNode
  className?: string
  clearable?: boolean
  closeOnBlur?: boolean
  closeOnEscape?: boolean
  closeOnChange?: boolean
  compact?: boolean
  deburr?: boolean
  defaultOpen?: boolean
  defaultSearchQuery?: string
  defaultSelectedLabel?: number | string
  defaultUpward?: boolean
  defaultValue?: string | number | boolean | (number | string | boolean)[]
  direction?: 'left' | 'right'
  disabled?: boolean
  error?: boolean
  floating?: boolean
  fluid?: boolean
  header?: React.ReactNode
  icon?: any
  inline?: boolean
  item?: boolean
  labeled?: boolean
  lazyLoad?: boolean
  loading?: boolean
  minCharacters?: number
  multiple?: boolean
  noResultsMessage?: React.ReactNode
  onAddItem?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void
  onBlur?: (event: React.FocusEvent<HTMLElement>, data: DropdownProps) => void
  onChange?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void
  onClick?: (event: React.MouseEvent<HTMLElement>, data: DropdownProps) => void
  onClose?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void
  onFocus?: (event: React.FocusEvent<HTMLElement>, data: DropdownProps) => void
  onLabelClick?: (event: React.MouseEvent<HTMLElement>, data: LabelProps) => void
  onMouseDown?: (event: React.MouseEvent<HTMLElement>, data: DropdownProps) => void
  onOpen?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void
  onSearchChange?: (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData,
  ) => void
  open?: boolean
  openOnFocus?: boolean
  options?: DropdownItemProps[]
  placeholder?: string
  pointing?:
    | boolean
    | 'left'
    | 'right'
    | 'top'
    | 'top left'
    | 'top right'
    | 'bottom'
    | 'bottom left'
    | 'bottom right'
  renderLabel?: (item: DropdownItemProps, index: number, defaultLabelProps: LabelProps) => any
  scrolling?: boolean
  search?: boolean | ((options: DropdownItemProps[], value: string) => DropdownItemProps[])
  searchInput?: any
  searchQuery?: string
  selectOnBlur?: boolean
  selectOnNavigation?: boolean
  selectedLabel?: number | string
  selection?: any
  simple?: boolean
  tabIndex?: number | string
  text?: string
  trigger?: React.ReactNode
  value?: boolean | number | string | (boolean | number | string)[]
  upward?: boolean
  wrapSelection?: boolean
  style?: React.CSSProperties;
  initialOptions?: IOption[];
  initialTags?: string[];
}


const TechInput: React.FC<IDropdownProps> = ({
  options = [],
  initialTags = [],
  onChange,
  ...props
}) => {

  const [tags, setTags] = useState<string[]>(initialTags);
  const [optionsData, setOptionsData] = useState(options);

  const handleAddItem = (event: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
    setOptionsData([...optionsData, {key: data.value, text: data.value, value: data.value}]);
  };

  const handleChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
    const newTags = data.value as string[];
    setTags(newTags);
    if (onChange) {
      onChange(event, newTags);
    }
  };

  return (
    <SemanticDropdown
      {...props}
      allowAdditions={true}
      fluid={true}
      multiple={true}
      onAddItem={handleAddItem}
      onChange={handleChange}
      options={optionsData}
      search={true}
      selection={true}
      value={tags}
      className={styles.resetSemantic}
    />
  );
};
export default TechInput;
