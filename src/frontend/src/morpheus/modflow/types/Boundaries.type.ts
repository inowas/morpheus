import {LineString, Point, Polygon} from 'geojson';
import {IAffectedCells} from './SpatialDiscretization.type';
import {ILayerId} from './Layers.type';


type IBoundaryId = string;


interface IGenericBoundary<T> {
  id: IBoundaryId;
  type: IBoundaryType;
  name: string;
  interpolation: IInterpolationType;
  tags: string[];
  geometry: Point | LineString | Polygon;
  affected_cells: IAffectedCells;
  affected_layers: ILayerId[]
  observations: IObservation<T>[];
  enabled: boolean;
}

export type IBoundaryType = 'constant_head' | 'drain' | 'evapotranspiration' | 'flow_and_head' | 'general_head' | 'lake' | 'recharge' | 'river' | 'well';

export type IInterpolationType = 'none' | 'forward_fill' | 'linear' | 'nearest';

export type IObservationId = string;

export interface IObservation<T> {
  observation_id: IObservationId;
  observation_name: string;
  geometry: Point;
  data: T[];
}

export interface IConstantHeadObservationValue {
  date_time: string;
  head: number;
}

export interface IConstantHeadBoundary extends IGenericBoundary<IConstantHeadObservationValue> {
  type: 'constant_head';
  geometry: LineString;
}

export interface IDrainObservationValue {
  date_time: string;
  stage: number;
  conductance: number;
}

export interface IDrainBoundary extends IGenericBoundary<IDrainObservationValue> {
  type: 'drain';
  geometry: LineString;
}

export interface IEvapotranspirationObservationValue {
  date_time: string;
  surface_elevation: number;
  evapotranspiration: number;
  extinction_depth: number;
}

export interface IEvapotranspirationBoundary extends IGenericBoundary<IEvapotranspirationObservationValue> {
  type: 'evapotranspiration';
  geometry: Polygon;
}


export interface IFlowAndHeadObservationValue {
  date_time: string;
  flow?: number;
  head?: number;
}

export interface IFlowAndHeadBoundary extends IGenericBoundary<IFlowAndHeadObservationValue> {
  type: 'flow_and_head';
  geometry: LineString;
}

export interface IGeneralHeadObservationValue {
  date_time: string;
  stage: number;
  conductance: number;
}

export interface IGeneralHeadBoundary extends IGenericBoundary<IGeneralHeadObservationValue> {
  type: 'general_head';
  geometry: LineString;
}

export interface ILakeObservationValue {
  date_time: string;
  precipitation: number;
  evaporation: number;
  runoff: number;
  withdrawal: number;
}

export interface ILakeBoundary extends IGenericBoundary<ILakeObservationValue> {
  type: 'lake';
  geometry: Polygon;
}

export interface IRechargeObservationValue {
  date_time: string;
  recharge_rate: number;
}

export interface IRechargeBoundary extends IGenericBoundary<IRechargeObservationValue> {
  type: 'recharge';
  geometry: Polygon;
}

export interface IRiverObservationValue {
  date_time: string;
  river_stage: number;
  riverbed_bottom: number;
  conductance: number;
}

export interface IRiverBoundary extends IGenericBoundary<IRiverObservationValue> {
  type: 'river';
  geometry: LineString;
}


export interface IWellObservationValue {
  date_time: string;
  pumping_rate: number;
}

export interface IWellBoundary extends IGenericBoundary<IWellObservationValue> {
  type: 'well';
  geometry: Point;
}

interface ISelectedBoundaryAndObservation {
  boundary: IBoundary;
  observationId?: IObservationId;
}

type IBoundary =
  IConstantHeadBoundary
  | IDrainBoundary
  | IEvapotranspirationBoundary
  | IFlowAndHeadBoundary
  | IGeneralHeadBoundary
  | ILakeBoundary
  | IRechargeBoundary
  | IRiverBoundary
  | IWellBoundary;

type IBoundaryObservationValue = IConstantHeadObservationValue
  | IDrainObservationValue
  | IEvapotranspirationObservationValue
  | IFlowAndHeadObservationValue
  | IGeneralHeadObservationValue
  | ILakeObservationValue
  | IRechargeObservationValue
  | IRiverObservationValue
  | IWellObservationValue;


export type {IBoundary, IBoundaryId, IBoundaryObservationValue, ISelectedBoundaryAndObservation};


