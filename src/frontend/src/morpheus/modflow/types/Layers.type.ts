import {float} from '@kitware/vtk.js/types';
import {IAffectedCells} from './SpatialDiscretization.type';
import {MultiPolygon, Polygon} from 'geojson';

export interface ILayer {
  layer_id: string;
  name: string;
  description: string;
  confinement: ILayerConfinement;
  properties: ILayerProperties;
}

export type ILayerConfinement = 'confined' | 'convertible' | 'unconfined';

export type ILayerPropertyName = 'hk' | 'hani' | 'vka' | 'specific_storage' | 'specific_yield' | 'initial_head' | 'top' | 'bottom';

interface ILayerProperties {
  hk: ILayerPropertyValues;
  hani: ILayerPropertyValues;
  vka: ILayerPropertyValues
  specific_storage: ILayerPropertyValues;
  specific_yield: ILayerPropertyValues;
  top: ILayerPropertyValues | null;
  bottom: ILayerPropertyValues;
}

export interface ILayerPropertyValues {
  value: number;
  raster: ILayerPropertyValueRaster | null;
  zones: ILayerPropertyValueZone[] | null;
}

export interface ILayerPropertyValueRaster {
  data?: ILayerPropertyValueRasterData;
  reference?: ILayerPropertyValueRasterReference;
}

interface ILayerPropertyValueRasterData {
  data: number[][];
  nodata_value: number;
}

interface ILayerPropertyValueRasterReference {
  asset_id: string;
  band: number;
  nodata_value: number;
}

export interface ILayerPropertyValueZone {
  zone_id: string;
  affected_cells: IAffectedCells;
  geometry: Polygon | MultiPolygon;
  value: float;
}


export interface IStressPeriod {
  start_date_time: string;
  number_of_time_steps: number;
  time_step_multiplier: number;
  steady_state: boolean;
}

export enum ITimeUnit {
  SECONDS = 'seconds',
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  YEARS = 'years',
}

interface IRasterReference {
  asset_id: string;
  band: number;
}


// important for write api
export interface IChangeLayerPropertyValues {
  defaultValue?: number;
  rasterReference?: IRasterReference | null;
  zones?: IZone[] | null;
}

export interface IZone {
  zone_id?: string;
  geometry: Polygon | MultiPolygon;
  value: number;
}

export interface ILayerPropertyData {
  n_cols: number;
  n_rows: number;
  grid_height: number;
  grid_width: number;
  bounds: {
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
  }
  rotation: number;
  min_value: number;
  max_value: number;
  no_data_value: number;
  data: number[][];
}
