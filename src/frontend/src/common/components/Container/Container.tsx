import {SemanticShorthandContent, SemanticTEXTALIGNMENTS} from 'semantic-ui-react/dist/commonjs/generic';

import React from 'react';
import {Container as SemanticContainer} from 'semantic-ui-react';

export type IContainerProps = {
  as?: any
  children?: React.ReactNode
  className?: string
  content?: SemanticShorthandContent
  fluid?: boolean
  text?: boolean
  textAlign?: SemanticTEXTALIGNMENTS
  style?: React.CSSProperties;
};

const Container: React.FC<IContainerProps> = (props) => (
  <SemanticContainer {...props} />
);

export default Container;
