import {IconCorner, IconSizeProp} from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import {SemanticCOLORS, SemanticICONS} from 'semantic-ui-react/dist/commonjs/generic';

import React from 'react';
import {Icon as SemanticIcon} from 'semantic-ui-react';

export type IIconProps = {
  as?: any
  bordered?: boolean
  circular?: boolean
  className?: string
  color?: SemanticCOLORS
  corner?: boolean | IconCorner
  disabled?: boolean
  fitted?: boolean
  flipped?: 'horizontally' | 'vertically'
  inverted?: boolean
  link?: boolean
  loading?: boolean
  name?: SemanticICONS
  rotated?: 'clockwise' | 'counterclockwise'
  size?: IconSizeProp
  'aria-hidden'?: string
  'aria-label'?: string
  style?: React.CSSProperties;
  onClick?: any;
  onRemove?: (event: React.MouseEvent<HTMLElement>, data: IIconProps) => void;
};

const Icon: React.FC<IIconProps> = (props) => (
  <SemanticIcon {...props} />
);

export default Icon;
export type {SemanticICONS as IconNames};
