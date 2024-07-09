import {IBoundary} from './Boundaries.type';
import {ILayer} from './Layers.type';
import {ISpatialDiscretization} from './SpatialDiscretization.type';
import {ITimeDiscretization} from './TimeDiscretization.type';
import {IHeadObservation} from './HeadObservations.type';


interface IModel {
  model_id: string;
  spatial_discretization: ISpatialDiscretization | undefined;
  time_discretization: ITimeDiscretization | undefined;
  layers: ILayer[];
  boundaries: IBoundary[];
  observations: IHeadObservation[];
  transport: any;
  variable_density: any;
}

export type {IModel};
