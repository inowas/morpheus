import {SemanticCOLORS, SemanticSIZES} from 'semantic-ui-react/dist/commonjs/generic';

import React from 'react';
import {Label as SemanticLabel} from 'semantic-ui-react';

export type ILabelProps = {
  as?: any;
  active?: boolean;
  attached?: 'top' | 'bottom' | 'top right' | 'top left' | 'bottom left' | 'bottom right';
  basic?: boolean;
  children?: React.ReactNode;
  circular?: boolean;
  className?: string;
  color?: SemanticCOLORS;
  corner?: boolean | 'left' | 'right';
  content?: React.ReactNode;
  empty?: any;
  floating?: boolean;
  horizontal?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>, data: ILabelProps) => void;
  onRemove?: (event: React.MouseEvent<HTMLElement>, data: ILabelProps) => void;
  pointing?: boolean | 'above' | 'below' | 'left' | 'right';
  ribbon?: boolean | 'right';
  size?: SemanticSIZES;
  tag?: boolean;
  style?: React.CSSProperties;
};

const Label: React.FC<ILabelProps> = (props) => (
  <SemanticLabel {...props} />
);

export default Label;
