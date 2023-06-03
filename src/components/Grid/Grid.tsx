import React from 'react';
import {Grid as SemanticGrid} from 'semantic-ui-react';
import {SemanticFLOATS, SemanticTEXTALIGNMENTS, SemanticVERTICALALIGNMENTS, SemanticWIDTHS} from 'semantic-ui-react/dist/commonjs/generic';
import {GridReversedProp} from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import {GridOnlyProp} from 'semantic-ui-react/dist/commonjs/collections/Grid/GridColumn';
import {ItexiaCOLORS} from '../types/ItexiaColors.type';

export type IGridProps = {
  as?: any
  celled?: boolean | 'internally'
  centered?: boolean
  children?: React.ReactNode
  className?: string
  columns?: SemanticWIDTHS | 'equal'
  container?: boolean
  divided?: boolean | 'vertically'
  doubling?: boolean
  inverted?: boolean
  padded?: boolean | 'horizontally' | 'vertically'
  relaxed?: boolean | 'very'
  reversed?: GridReversedProp
  stackable?: boolean
  stretched?: boolean
  textAlign?: SemanticTEXTALIGNMENTS
  verticalAlign?: SemanticVERTICALALIGNMENTS
  style?: React.CSSProperties;
};

const Grid: React.FC<IGridProps> = (props) => (
  <SemanticGrid {...props} />
);

export type IGridColumnProps = {
  as?: any
  children?: React.ReactNode
  className?: string
  color?: ItexiaCOLORS
  computer?: SemanticWIDTHS
  floated?: SemanticFLOATS
  largeScreen?: SemanticWIDTHS
  mobile?: SemanticWIDTHS
  only?: GridOnlyProp
  stretched?: boolean
  tablet?: SemanticWIDTHS
  textAlign?: SemanticTEXTALIGNMENTS
  verticalAlign?: SemanticVERTICALALIGNMENTS
  widescreen?: SemanticWIDTHS
  width?: SemanticWIDTHS
  style?: React.CSSProperties;
};

const Column: React.FC<IGridColumnProps> = (props) => (
  <SemanticGrid.Column {...props} />
);

export type IGridRowProps = {
  as?: any
  centered?: boolean
  children?: React.ReactNode
  className?: string
  color?: ItexiaCOLORS
  columns?: SemanticWIDTHS | 'equal'
  divided?: boolean
  only?: GridOnlyProp
  reversed?: GridReversedProp
  stretched?: boolean
  textAlign?: SemanticTEXTALIGNMENTS
  verticalAlign?: SemanticVERTICALALIGNMENTS
  style?: React.CSSProperties;
};

const Row: React.FC<IGridRowProps> = (props) => (
  <SemanticGrid.Row {...props} />
);


export {Column, Row};


export default Grid;
