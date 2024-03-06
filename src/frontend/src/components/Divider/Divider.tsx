import React from 'react';
import {Divider as SemanticDivider} from 'semantic-ui-react';
import {SemanticShorthandContent} from 'semantic-ui-react/dist/commonjs/generic';

export type IDividerProps = {
  as?: any
  children?: React.ReactNode
  className?: string
  clearing?: boolean
  content?: SemanticShorthandContent
  fitted?: boolean
  hidden?: boolean
  horizontal?: boolean
  inverted?: boolean
  section?: boolean
  vertical?: boolean
  style?: React.CSSProperties;
};

const Divider: React.FC<IDividerProps> = (props) => (
  <SemanticDivider {...props} />
);

export default Divider;
