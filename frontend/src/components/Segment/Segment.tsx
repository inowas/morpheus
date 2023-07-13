import React from 'react';
import {Segment as SemanticSegment} from 'semantic-ui-react';
import {SemanticCOLORS, SemanticFLOATS, SemanticShorthandContent, SemanticTEXTALIGNMENTS} from 'semantic-ui-react/dist/commonjs/generic';
import {SegmentSizeProp} from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';


export type ISegmentProps = {
  as?: any
  attached?: boolean | 'top' | 'bottom'
  basic?: boolean
  children?: React.ReactNode
  circular?: boolean
  className?: string
  clearing?: boolean
  color?: SemanticCOLORS
  compact?: boolean
  content?: SemanticShorthandContent
  disabled?: boolean
  floated?: SemanticFLOATS
  inverted?: boolean
  loading?: boolean
  padded?: boolean | 'very'
  placeholder?: boolean
  piled?: boolean
  raised?: boolean
  secondary?: boolean
  size?: SegmentSizeProp
  stacked?: boolean
  tertiary?: boolean
  textAlign?: SemanticTEXTALIGNMENTS
  vertical?: boolean
  onClick?: any
  style?: React.CSSProperties;
};

const Segment: React.FC<ISegmentProps> = (props) => (
  <SemanticSegment {...props} />
);

export type ISegmentGroupProps = {
  as?: any
  children?: React.ReactNode
  className?: string
  compact?: boolean
  content?: SemanticShorthandContent
  horizontal?: boolean
  piled?: boolean
  raised?: boolean
  size?: SegmentSizeProp
  stacked?: boolean
  style?: React.CSSProperties;
};

const Group: React.FC<ISegmentGroupProps> = (props) => (
  <SemanticSegment.Group {...props} />
);
export {Group};
export default Segment;
