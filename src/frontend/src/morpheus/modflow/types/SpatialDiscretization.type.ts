import {Point, Polygon} from 'geojson';

export interface ISpatialDiscretization {
  geometry: Polygon;
  grid: IGrid;
  affected_cells: IAffectedCells | null;
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

  del_col_absolute: number[]; // length of each column (sums up to del_col_total)
  del_col_total: number; // total length of all columns
  del_col_relative: number[]; // relative length of each column (sums up to 1)

  del_row_absolute: number; // length of each row (sums up to del_row_total)
  del_row_total: number; // total length of all rows
  del_row_relative: number[]; // relative length of each row (sums up to 1)

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
