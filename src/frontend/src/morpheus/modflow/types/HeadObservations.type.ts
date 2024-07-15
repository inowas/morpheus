import {Point} from 'geojson';
import {IAffectedCells} from './SpatialDiscretization.type';
import {ILayerId} from './Layers.type';

type IObservationId = string;

interface IHeadObservation {
  id: IObservationId;
  type: IObservationType;
  name: string;
  tags: string[];
  geometry: Point
  affected_cells: IAffectedCells;
  affected_layers: ILayerId[]
  data: IHeadObservationData[];
  enabled: boolean;
}

interface IHeadObservationData {
  date_time: string;
  head: number;
}

type IObservationResult = {
  observation_id: string;
  observation_name: string;
  layer: number;
  row: number;
  col: number;
  date_time: string;
  simulated: number;
  observed: number;
};

interface IStatistics {
  names: string[];
  data: Array<{
    name: string;
    simulated: number;
    observed: number;
    residual: number;
    absResidual: number;
    npf: number;
  }>;
  stats: {
    observed: {
      std: number;
      z: number;
      deltaStd: number;
    };
    simulated: {
      std: number;
    };
    residual: {
      std: number;
      sse: number;
      rmse: number;
      nrmse: number;
      min: number;
      max: number;
      mean: number;
    };
    absResidual: {
      max: number;
      mean: number;
      min: number;
    };
  };
  linRegObsSim: ILinearRegression;
  linRegResSim: ILinearRegression;
  linRegObsRResNpf: ILinearRegression;
}

interface ILinearRegression {
  slope: number;
  intercept: number;
  r: number;
  r2: number;
  sse: number;
  ssr: number;
  sst: number;
  sy: number;
  sx: number;
  see: number;
  eq: string;
}


type IObservationData = IHeadObservationData;

type IObservationType = 'head';

export type {IHeadObservation, IHeadObservationData, IObservationType, IObservationId, IObservationData, IObservationResult, IStatistics, ILinearRegression};
