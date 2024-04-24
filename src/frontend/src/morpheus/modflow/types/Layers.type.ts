import {float} from '@kitware/vtk.js/types';
import {IAffectedCells} from './SpatialDiscretization.type';
import {MultiPolygon, Polygon} from 'geojson';

export interface ILayer {
  layer_id: string;
  name: string;
  description: string;
  type: ILayerType;
  properties: ILayerProperties;
}

type ILayerType = 'confined' | 'convertible' | 'unconfined';

interface ILayerProperties {
  kx: ILayerPropertyValues;
  ky: ILayerPropertyValues | null;
  kz: ILayerPropertyValues | null;
  hani: ILayerPropertyValues | null;
  vani: ILayerPropertyValues | null;
  specific_storage: ILayerPropertyValues;
  specific_yield: ILayerPropertyValues;
  top: ILayerPropertyValues | null;
  bottom: ILayerPropertyValues;
}

interface ILayerPropertyValues {
  value: number;
  raster: ILayerPropertyValueRaster | null;
  zones: ILayerPropertyValueZone[] | null;
}

interface ILayerPropertyValueRaster {
  data: ILayerPropertyValueRasterData;
  reference: ILayerPropertyValueRasterReference | null;
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

interface ICreateLayerPropertyValueZone {
  affected_cells: IAffectedCells;
  geometry: Polygon | MultiPolygon;
}

interface ILayerPropertyValueZone {
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
