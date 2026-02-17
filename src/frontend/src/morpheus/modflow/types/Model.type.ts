import {IBoundary} from './Boundaries.type';
import {ILayer} from './Layers.type';
import {ISpatialDiscretization} from './SpatialDiscretization.type';
import {ITimeDiscretization} from './TimeDiscretization.type';
import {IObservation} from './Observations.type';


interface IModel {
  model_id: string;
  spatial_discretization: ISpatialDiscretization | undefined;
  time_discretization: ITimeDiscretization | undefined;
  layers: ILayer[];
  boundaries: IBoundary[];
  observations: IObservation[];
  transport: any;
  variable_density: any;
}

export type {IModel};
