import React from 'react';
import {Button as SemanticButton, SemanticCOLORS, SemanticShorthandItem, SemanticSIZES} from 'semantic-ui-react';
import {ButtonProps} from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import {IconProps} from 'semantic-ui-react/dist/commonjs/elements/Icon';

export type IButtonProps = {
  active?: boolean;
  animated?: boolean;
  attached?: boolean | 'left' | 'right' | 'top' | 'bottom';
  basic?: boolean;
  children?: React.ReactNode;
  circular?: boolean;
  className?: string;
  color?: SemanticCOLORS;
  compact?: boolean;
  content?: React.ReactNode;
  disabled?: boolean;
  floated?: 'left' | 'right';
  fluid?: boolean;
  icon?: boolean | SemanticShorthandItem<IconProps>;
  inverted?: boolean;
  label?: boolean | string;
  labelPosition?: 'left' | 'right';
  loading?: boolean;
  negative?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps | IButtonProps) => void;
  positive?: boolean;
  primary?: boolean;
  role?: string;
  secondary?: boolean;
  size?: SemanticSIZES;
  tabIndex?: number;
  toggle?: boolean;
  type?: 'button' | 'reset' | 'submit';
  style?: React.CSSProperties;
  id?: string;
};

const Button: React.FC<IButtonProps> = ({className, ...props}) => (
  <SemanticButton {...props}/>
);

export default Button;
