import React from 'react';
import {Image as SemanticImage} from 'semantic-ui-react';
import {SemanticFLOATS, SemanticShorthandContent, SemanticShorthandItem, SemanticSIZES, SemanticVERTICALALIGNMENTS} from 'semantic-ui-react/dist/commonjs/generic';
import {DimmerProps} from 'semantic-ui-react/dist/commonjs/modules/Dimmer';
import {LabelProps} from 'semantic-ui-react/dist/commonjs/elements/Label';


export type IImageProps = {
  as?: any
  avatar?: boolean
  bordered?: boolean
  centered?: boolean
  children?: React.ReactNode
  circular?: boolean
  className?: string
  content?: SemanticShorthandContent
  disabled?: boolean
  dimmer?: SemanticShorthandItem<DimmerProps>
  floated?: SemanticFLOATS
  fluid?: boolean
  hidden?: boolean
  href?: string
  inline?: boolean
  label?: SemanticShorthandItem<LabelProps>
  rounded?: boolean
  size?: SemanticSIZES
  spaced?: boolean | 'left' | 'right'
  ui?: boolean
  verticalAlign?: SemanticVERTICALALIGNMENTS
  wrapped?: boolean
  src: any;
  style?: React.CSSProperties;
  [key: string]: any
};

const Image: React.FC<IImageProps> = (props) => (
  <SemanticImage {...props} />
);

export default Image;
