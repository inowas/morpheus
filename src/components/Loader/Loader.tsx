import React from 'react';
import {Loader as SemanticLoader} from 'semantic-ui-react';
import {SemanticShorthandContent, SemanticSIZES} from 'semantic-ui-react/dist/commonjs/generic';


export type ILoaderProps = {
  as?: any
  active?: boolean
  children?: React.ReactNode
  className?: string
  content?: SemanticShorthandContent
  disabled?: boolean
  indeterminate?: boolean
  inline?: boolean | 'centered'
  inverted?: boolean
  size?: SemanticSIZES
  style?: React.CSSProperties;
};

const Loader: React.FC<ILoaderProps> = (props) => (
  <SemanticLoader {...props} />
);

export default Loader;