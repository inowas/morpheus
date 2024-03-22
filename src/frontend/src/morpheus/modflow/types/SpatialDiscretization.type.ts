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
  x_distances: number[];
  y_distances: number[];
  origin: Point
  rotation: number;
  length_unit: string;
}

export enum ILengthUnit {
  UNDEFINED = 0,
  FEET = 1,
  METERS = 2,
  CENTIMETERS = 3,
}
