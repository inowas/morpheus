import {LineString, Point, Polygon} from "geojson";
import {IAffectedCells} from "./SpatialDiscretization.type";
import {ILayerId} from "./Layers.type";


type IBoundaryId = string;


interface IGenericBoundary<T> {
  id: IBoundaryId;
  type: IBoundaryType;
  name: string;
  tags: string[];
  geometry: Point | LineString | Polygon;
  affected_cells: IAffectedCells;
  affected_layers: ILayerId[]
  observations: IObservation<T>[];
  enabled: boolean;
}

type IBoundaryType = 'constant_head' | 'drain' | 'evapotranspiration' | 'flow_and_head' | 'general_head' | 'lake' | 'recharge' | 'river' | 'well';

interface IObservation<T> {
  observation_id: string;
  observation_name: string;
  geometry: Point;
  data: T[]
}

interface IConstantHeadObservationData {
  date_time: string;
  head: number;
}

interface IConstantHeadBoundary extends IGenericBoundary<IConstantHeadObservationData> {
  type: 'constant_head';
  geometry: LineString;
}

interface IDrainObservationData {
  date_time: string;
  stage: number;
  conductance: number;
}

interface IDrainBoundary extends IGenericBoundary<IDrainObservationData> {
  type: 'drain';
  geometry: LineString;
}

interface IEvapotranspirationObservationData {
  date_time: string;
  surface_elevation: number;
  evapotranspiration: number;
  extinction_depth: number;
}

interface IEvapotranspirationBoundary extends IGenericBoundary<IEvapotranspirationObservationData> {
  type: 'evapotranspiration';
  geometry: Polygon;
}


interface IFlowAndHeadObservationData {
  date_time: string;
  flow?: number;
  head?: number;
}

interface IFlowAndHeadBoundary extends IGenericBoundary<IFlowAndHeadObservationData> {
  type: 'flow_and_head';
  geometry: LineString;
}

interface IGeneralHeadObservationData {
  date_time: string;
  stage: number;
  conductance: number;
}

interface IGeneralHeadBoundary extends IGenericBoundary<IGeneralHeadObservationData> {
  type: 'general_head';
  geometry: LineString;
}

interface ILakeObservationData {
  date_time: string;
  precipitation: number;
  evaporation: number;
  runoff: number;
  withdrawal: number;
}

interface ILakeBoundary extends IGenericBoundary<ILakeObservationData> {
  type: 'lake';
  geometry: Polygon;
}

interface IRechargeObservationData {
  date_time: string;
  recharge_rate: number;
}

interface IRechargeBoundary extends IGenericBoundary<IRechargeObservationData> {
  type: 'recharge';
  geometry: Polygon;
}

interface IRiverObservationData {
  date_time: string;
  river_stage: number;
  riverbed_bottom: number;
  conductance: number;
}

interface IRiverBoundary extends IGenericBoundary<IRiverObservationData> {
  type: 'river';
  geometry: LineString;
}


interface IWellObservationData {
  date_time: string;
  pumping_rate: number;
}

interface IWellBoundary extends IGenericBoundary<IWellObservationData> {
  type: 'well';
  geometry: Point;
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


export type {IBoundary, IBoundaryId}
