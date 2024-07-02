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

export type IInterpolationType = 'none' | 'nearest' | 'linear' | 'backward_fill' | 'forward_fill';

export type IObservationId = string;

export interface IObservation<T> {
  observation_id: IObservationId;
  observation_name: string;
  geometry: Point;
  data: T[];
}

export interface IConstantHeadObservationData {
  date_time: string;
  head: number;
}

export interface IConstantHeadBoundary extends IGenericBoundary<IConstantHeadObservationData> {
  type: 'constant_head';
  geometry: LineString;
}

export interface IDrainObservationData {
  date_time: string;
  stage: number;
  conductance: number;
}

export interface IDrainBoundary extends IGenericBoundary<IDrainObservationData> {
  type: 'drain';
  geometry: LineString;
}

export interface IEvapotranspirationObservationData {
  date_time: string;
  surface_elevation: number;
  evapotranspiration: number;
  extinction_depth: number;
}

export interface IEvapotranspirationBoundary extends IGenericBoundary<IEvapotranspirationObservationData> {
  type: 'evapotranspiration';
  geometry: Polygon;
}


export interface IFlowAndHeadObservationData {
  date_time: string;
  flow?: number;
  head?: number;
}

export interface IFlowAndHeadBoundary extends IGenericBoundary<IFlowAndHeadObservationData> {
  type: 'flow_and_head';
  geometry: LineString;
}

export interface IGeneralHeadObservationData {
  date_time: string;
  stage: number;
  conductance: number;
}

export interface IGeneralHeadBoundary extends IGenericBoundary<IGeneralHeadObservationData> {
  type: 'general_head';
  geometry: LineString;
}

export interface ILakeObservationData {
  date_time: string;
  precipitation: number;
  evaporation: number;
  runoff: number;
  withdrawal: number;
}

export interface ILakeBoundary extends IGenericBoundary<ILakeObservationData> {
  type: 'lake';
  geometry: Polygon;
}

export interface IRechargeObservationData {
  date_time: string;
  recharge_rate: number;
}

export interface IRechargeBoundary extends IGenericBoundary<IRechargeObservationData> {
  type: 'recharge';
  geometry: Polygon;
}

export interface IRiverObservationData {
  date_time: string;
  river_stage: number;
  riverbed_bottom: number;
  conductance: number;
}

export interface IRiverBoundary extends IGenericBoundary<IRiverObservationData> {
  type: 'river';
  geometry: LineString;
}


export interface IWellObservationData {
  date_time: string;
  pumping_rate: number;
}

export interface IWellBoundary extends IGenericBoundary<IWellObservationData> {
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

type IBoundaryObservationData = IConstantHeadObservationData
  | IDrainObservationData
  | IEvapotranspirationObservationData
  | IFlowAndHeadObservationData
  | IGeneralHeadObservationData
  | ILakeObservationData
  | IRechargeObservationData
  | IRiverObservationData
  | IWellObservationData;


export type {IBoundary, IBoundaryId, IBoundaryObservationData, ISelectedBoundaryAndObservation};


export const availableBoundaries: { title: string, type: IBoundaryType, keys: string[] }[] = [
  {title: 'Constant Head Boundaries', type: 'constant_head', keys: ['date_time', 'head']},
  {title: 'Drain Boundaries', type: 'drain', keys: ['date_time', 'stage', 'conductance']},
  {title: 'Evapotranspiration Boundaries', type: 'evapotranspiration', keys: ['date_time', 'surface_elevation', 'evapotranspiration']},
  {title: 'Flow and Head Boundaries', type: 'flow_and_head', keys: ['date_time', 'flow', 'head']},
  {title: 'General Head Boundaries', type: 'general_head', keys: ['date_time', 'stage', 'conductance']},
  {title: 'Lake Boundaries', type: 'lake', keys: ['date_time', 'precipitation', 'evaporation', 'runoff', 'withdrawal']},
  {title: 'Recharge', type: 'recharge', keys: ['date_time', 'recharge_rate']},
  {title: 'River', type: 'river', keys: ['date_time', 'river_stage', 'riverbed_bottom', 'conductance']},
  {title: 'Well Boundaries', type: 'well', keys: ['date_time', 'pumping_rate']},
];


