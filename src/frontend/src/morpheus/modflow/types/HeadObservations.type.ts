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


type IObservationType = 'head';

export type {IHeadObservation, IHeadObservationData, IObservationType, IObservationId};
