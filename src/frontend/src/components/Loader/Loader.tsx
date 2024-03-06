import {SemanticSIZES, SemanticShorthandContent} from 'semantic-ui-react/dist/commonjs/generic';

import React from 'react';
import {Loader as SemanticLoader} from 'semantic-ui-react';

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