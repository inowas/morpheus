import React, {forwardRef, RefObject} from 'react';
import {Input as SemanticInput} from 'semantic-ui-react';
import {HtmlInputrops, SemanticShorthandItem} from 'semantic-ui-react/dist/commonjs/generic';
import {LabelProps} from 'semantic-ui-react/dist/commonjs/elements/Label';
import {InputOnChangeData, InputProps} from 'semantic-ui-react/dist/commonjs/elements/Input/Input';

interface IInputProps extends IProps {
  [key: string]: any
}

type IInputOnChangeData = InputOnChangeData;

export type IProps = {
  as?: any
  name?: string
  value?: any
  id?: string
  action?: any | boolean
  actionPosition?: 'left'
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  error?: boolean
  fluid?: boolean
  focus?: boolean
  icon?: any | SemanticShorthandItem<InputProps>
  iconPosition?: 'left'
  input?: SemanticShorthandItem<HtmlInputrops>
  inverted?: boolean
  label?: SemanticShorthandItem<LabelProps>
  labelPosition?: 'left' | 'right' | 'left corner' | 'right corner'
  loading?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void
  size?: 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive'
  tabIndex?: number | string
  transparent?: boolean
  type?: string
  style?: React.CSSProperties
};

const Input = forwardRef<HTMLInputElement, IInputProps>((props: IProps, ref) => {
  return (<SemanticInput {...props} ref={ref as RefObject<SemanticInput>}/>);
});

export default Input;
export type {IInputOnChangeData, IInputProps};
