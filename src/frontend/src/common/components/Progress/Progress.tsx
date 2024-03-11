import {HtmlLabelProps, SemanticCOLORS, SemanticShorthandContent, SemanticShorthandItem} from 'semantic-ui-react/dist/commonjs/generic';

import React from 'react';
import {Progress as SemanticProgress} from 'semantic-ui-react';

export type IProgressProps = {
  as?: any
  active?: boolean
  attached?: 'top' | 'bottom'
  autoSuccess?: boolean
  children?: React.ReactNode
  className?: string
  color?: SemanticCOLORS
  content?: SemanticShorthandContent
  disabled?: boolean
  error?: boolean
  indicating?: boolean
  inverted?: boolean
  label?: SemanticShorthandItem<HtmlLabelProps>
  percent?: number | string
  precision?: number
  progress?: boolean | 'percent' | 'ratio' | 'value'
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'big'
  success?: boolean
  total?: number | string
  value?: number | string
  warning?: boolean
  style?: React.CSSProperties;
};

const Progress: React.FC<IProgressProps> = (props) => (
  <SemanticProgress {...props} />
);

export default Progress;
