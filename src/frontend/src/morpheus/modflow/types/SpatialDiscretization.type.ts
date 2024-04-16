import {Point, Polygon} from 'geojson';
import cloneDeep from 'lodash.clonedeep';

export interface ISpatialDiscretization {
  geometry: Polygon;
  grid: IGrid;
  affected_cells?: IAffectedCells;
}

export type IAffectedCells = IAffectedCellsAsRaster | IAffectedCellsAsSparse;

interface IAffectedCellsAsRaster {
  type: 'raster';
  shape: [number, number];
  data: boolean[][]; // [row][col]
}

interface IAffectedCellsAsSparse {
  type: 'sparse' | 'sparse_inverse';
  shape: [number, number];
  data: Array<[number, number]>; // [row, col]
}

export interface IGrid {
  n_cols: number;
  n_rows: number;

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


export class AffectedCells {

  private readonly _type: 'raster' | 'sparse' | 'sparse_inverse';

  private _data: boolean[][] | Array<[number, number]>;

  private readonly _shape: [number, number];

  get data() {
    return this._data;
  }

  set data(data: boolean[][] | Array<[number, number]>) {
    this._data = data;
  }

  get shape() {
    return this._shape;
  }

  get type() {
    return this._type;
  }


  private constructor(cells: IAffectedCells) {
    this._type = cells.type;
    this._data = cells.data;
    this._shape = cells.shape;
  }

  public static fromObject(obj: IAffectedCells): AffectedCells {
    return new AffectedCells(obj);
  }

  public setActive(row: number, col: number, active: boolean) {


    if (0 > row || row >= this.shape[0] || 0 > col || col >= this.shape[1]) {
      return;
    }

    if ('raster' === this.type) {
      let rasterData = cloneDeep(this.data as boolean[][]);
      rasterData[row][col] = active;
      this.data = rasterData;
    }

    if ('sparse' === this.type) {
      let sparseData = cloneDeep(this.data as Array<[number, number]>);
      sparseData = sparseData.filter((c) => c[0] !== row && c[1] !== col);
      if (active) {
        sparseData.push([row, col]);
      }
      this.data = sparseData;
    }

    if ('sparse_inverse' === this.type) {
      let sparseInverseData = cloneDeep(this.data as Array<[number, number]>);
      sparseInverseData = sparseInverseData.filter((c) => c[0] !== row && c[1] !== col);
      if (!active) {
        sparseInverseData.push([row, col]);
      }
      this.data = sparseInverseData;
    }
  }

  public toRaster(): boolean[][] {
    if ('raster' === this.type) {
      return cloneDeep(this.data as boolean[][]);
    }

    if ('sparse' === this.type) {
      const raster = new Array(this.shape[0]).fill(false).map(() => new Array(this.shape[1]).fill(false));
      (this.data as Array<[number, number]>).forEach((c) => {
        raster[c[0]][c[1]] = true;
      });
      return raster;
    }

    if ('sparse_inverse' === this.type) {
      const raster = new Array(this.shape[0]).fill(true).map(() => new Array(this.shape[1]).fill(true));
      (this.data as Array<[number, number]>).forEach((c) => {
        raster[c[0]][c[1]] = false;
      });
      return raster;
    }

    return [];
  }

  public isEqual(cells: AffectedCells): boolean {
    if (this.shape !== cells.shape) {
      return false;
    }

    if (this.type !== cells.type) {
      return false;
    }

    return JSON.stringify(this.data.toSorted()) === JSON.stringify(cells.data.toSorted());
  }

  public toObject() {
    return {
      type: this.type,
      data: this.data,
      shape: this.shape,
    };
  }
}
