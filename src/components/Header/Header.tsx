import React from 'react';
import {Header as SemanticHeader} from 'semantic-ui-react';
import {SemanticCOLORS, SemanticFLOATS, SemanticTEXTALIGNMENTS} from 'semantic-ui-react/dist/commonjs/generic';

export type IHeaderProps = {
  as?: any
  attached?: boolean | 'top' | 'bottom'
  block?: boolean
  children?: React.ReactNode
  className?: string
  color?: SemanticCOLORS
  content?: React.ReactNode
  disabled?: boolean
  dividing?: boolean
  floated?: SemanticFLOATS
  icon?: any
  image?: any
  inverted?: boolean
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge'
  sub?: boolean
  subheader?: any
  textAlign?: SemanticTEXTALIGNMENTS
  style?: React.CSSProperties;
};

const Header: React.FC<IHeaderProps> = (props) => (
  <SemanticHeader {...props} />
);

export default Header;
