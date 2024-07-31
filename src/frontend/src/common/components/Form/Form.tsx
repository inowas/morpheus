import React from 'react';
import {Checkbox as SemanticCheckbox, Form as SemanticForm, Label as SemanticLabel, StrictRadioProps} from 'semantic-ui-react';
import {HtmlLabelProps, SemanticShorthandItem, SemanticWIDTHS} from 'semantic-ui-react/dist/commonjs/generic';
import {LabelProps} from 'semantic-ui-react/dist/commonjs/elements/Label';
import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';
import {StrictDropdownProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import {StrictFormGroupProps} from 'semantic-ui-react/dist/commonjs/collections/Form/FormGroup';
import {InputOnChangeData, StrictInputProps} from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
import styles from './Form.module.less';

export type IFormProps = React.ComponentPropsWithoutRef<typeof SemanticForm>;

const Form: React.FC<IFormProps> = (props) => (
  <SemanticForm {...props} />
);

export interface IFormInputProps extends StrictInputProps, InputOnChangeData {
  as?: any;
  control?: any;
  error?: any;
  label?: SemanticShorthandItem<LabelProps>;
  value: string;
}

const Input: React.FC<IFormInputProps> = (props) => (
  <SemanticForm.Input {...props} />
);

export interface IFormDropdownProps extends StrictDropdownProps {
  as?: any;
  name?: string;
  control?: any;
  error?: any;
  readOnly?: boolean;
  style?: React.CSSProperties;
  onKeyPress?: (event: KeyboardEvent) => void;
}

const Dropdown: React.FC<IFormDropdownProps> = ({className, ...props}) => (
  <SemanticForm.Dropdown {...props} className={[styles.resetSemantic, className].join(' ')}/>
);

export interface IFormRadioProps extends StrictRadioProps {
  as?: any;
  control?: any;
  error?: any;
}

const Radio: React.FC<IFormRadioProps> = (props) => (
  <SemanticForm.Radio {...props} />
);

export interface IFormGroupProps extends StrictFormGroupProps {
  as?: any;
  children?: React.ReactNode;
  className?: string;
  grouped?: boolean;
  inline?: boolean;
  unstackable?: boolean;
  widths?: SemanticWIDTHS | 'equal';
}

const Group: React.FC<IFormGroupProps> = (props) => (
  <SemanticForm.Group {...props} />
);

export interface IFormLabelProps extends LabelProps {
  as?: any;
}

const Label: React.FC<IFormLabelProps> = (props) => (
  <SemanticLabel {...props} />
);

export interface IFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  control?: any;
  disabled?: boolean;
  style?: React.CSSProperties;
  width?: SemanticWIDTHS;
}

const FormField: React.FC<IFormFieldProps> = (props) => (
  <SemanticForm.Field {...props} />
);


export type StrictCheckboxProps = {
  as?: any;
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  defaultIndeterminate?: boolean;
  disabled?: boolean;
  fitted?: boolean;
  id?: number | string;
  indeterminate?: boolean;
  label?: SemanticShorthandItem<HtmlLabelProps>;
  name?: string;
  onChange?: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>, data: CheckboxProps) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLInputElement>, data: CheckboxProps) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLInputElement>, data: CheckboxProps) => void;
  radio?: boolean;
  readOnly?: boolean;
  slider?: boolean;
  tabIndex?: number | string;
  toggle?: boolean;
  type?: 'checkbox' | 'radio';
  value?: number | string;
  toggleStyle?: 'colored' | 'default';
  toggleSize?: 'small' | 'large';
  style?: React.CSSProperties;
};

export interface ICheckboxProps extends StrictCheckboxProps {
  [key: string]: any;
}

const Checkbox: React.FC<ICheckboxProps> = ({toggleStyle = 'default', toggleSize = 'small', ...props}) => {
  // Determine class name based on toggleStyle prop
  const className = 'colored' === toggleStyle ? 'colored-checkbox' : '';
  const sizeClassName = 'large' === toggleSize ? 'large-checkbox' : '';

  return <SemanticCheckbox {...props} className={`${className} ${sizeClassName}`}/>;
};
export {Input, Checkbox, Dropdown, Radio, Group, Label, FormField};

export default Form;
