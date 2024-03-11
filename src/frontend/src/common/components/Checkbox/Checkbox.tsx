import {HtmlLabelProps, SemanticShorthandItem} from 'semantic-ui-react/dist/commonjs/generic';

import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';
import React from 'react';
import {Checkbox as SemanticCheckbox} from 'semantic-ui-react';

export type StrictCheckboxProps = {
  as?: any
  checked?: boolean
  className?: string
  defaultChecked?: boolean
  defaultIndeterminate?: boolean
  disabled?: boolean
  fitted?: boolean
  id?: number | string
  indeterminate?: boolean
  label?: SemanticShorthandItem<HtmlLabelProps>
  name?: string
  onChange?: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>, data: CheckboxProps) => void
  onMouseDown?: (event: React.MouseEvent<HTMLInputElement>, data: CheckboxProps) => void
  onMouseUp?: (event: React.MouseEvent<HTMLInputElement>, data: CheckboxProps) => void
  radio?: boolean
  readOnly?: boolean
  slider?: boolean
  tabIndex?: number | string
  toggle?: boolean
  type?: 'checkbox' | 'radio'
  value?: number | string
  style?: React.CSSProperties;
};

export interface ICheckboxProps extends StrictCheckboxProps {
  [key: string]: any
}

const Checkbox: React.FC<ICheckboxProps> = (props) => (
  <SemanticCheckbox {...props} />
);

export default Checkbox;
