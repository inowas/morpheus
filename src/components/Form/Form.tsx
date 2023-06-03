import React from 'react';
import {Form as SemanticForm, StrictRadioProps} from 'semantic-ui-react';
import {FormProps} from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
import {SemanticShorthandItem, SemanticWIDTHS} from 'semantic-ui-react/dist/commonjs/generic';
import {LabelProps} from 'semantic-ui-react/dist/commonjs/elements/Label';
import {StrictDropdownProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import {StrictFormGroupProps} from 'semantic-ui-react/dist/commonjs/collections/Form/FormGroup';
import {InputOnChangeData, StrictInputProps} from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
import styles from './Form.module.less';

export type IFormProps = {
  as?: any
  action?: string
  children?: React.ReactNode
  className?: string
  error?: boolean
  inverted?: boolean
  loading?: boolean
  onSubmit?: (event: React.FormEvent<HTMLFormElement>, data: FormProps) => void
  reply?: boolean
  size?: string
  success?: boolean
  unstackable?: boolean
  warning?: boolean
  widths?: 'equal'
  style?: React.CSSProperties;
  id?: string;
};

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
  as?: any
  control?: any
  error?: any
}

const Radio: React.FC<IFormRadioProps> = (props) => (
  <SemanticForm.Radio {...props} />
);

export interface IFormGroupProps extends StrictFormGroupProps {
  as?: any
  children?: React.ReactNode
  className?: string
  grouped?: boolean
  inline?: boolean
  unstackable?: boolean
  widths?: SemanticWIDTHS | 'equal'
}

const Group: React.FC<IFormGroupProps> = (props) => (
  <SemanticForm.Group {...props} />
);

export {Input, Dropdown, Radio, Group};


export default Form;
