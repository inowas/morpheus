import {DropdownOnSearchChangeData, DropdownProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';

import {DropdownItemProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import {LabelProps} from 'semantic-ui-react/dist/commonjs/elements/Label';
import React from 'react';
import {Select as SemanticSelect} from 'semantic-ui-react';
import styles from './Select.module.less';

export type ISelectProps = {
  width?: string | number
  options: DropdownItemProps[];
  style?: React.CSSProperties;
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
};

const Select: React.FC<ISelectProps> = ({className, ...props}) => (
  <SemanticSelect {...props} className={[styles.resetSemantic, className].join(' ')}/>
);

export default Select;

export type {DropdownProps};
