import {Point, Polygon} from 'geojson';

export interface ISpatialDiscretization {
  geometry: Polygon;
  grid: IGrid;
  affected_cells?: IAffectedCells;
}

export type IAffectedCells = IAffectedCellsAsRaster | IAffectedCellsAsSparse;

interface IAffectedCellsAsRaster {
  type: 'raster';
  shape: [number, number];
  data: number[][];
}

interface IAffectedCellsAsSparse {
  type: 'sparse' | 'sparse_inverse';
  shape: [number, number];
  data: Array<[number, number]>; // [x, y]
}

export interface IGrid {
  n_col: number;
  n_row: number;

  col_widths: number[]; // length of each column (sums up to del_col_total)
  total_width: number; // total length of all columns

  row_heights: number[]; // length of each row (sums up to del_row_total)
  total_height: number; // total length of all rows

  origin: Point // top left corner of the grid
  rotation: number;
  length_unit: ILengthUnit;
}


export enum ILengthUnit {
  UNDEFINED = 'unknown',
  FEET = 'feet',
  METERS = 'meters',
  CENTIMETERS = 'centimeters',
}
