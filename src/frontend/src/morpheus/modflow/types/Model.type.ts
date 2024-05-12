import {ISpatialDiscretization} from './SpatialDiscretization.type';
import {ITimeDiscretization} from './TimeDiscretization.type';
import {ILayer} from './Layers.type';

interface IModel {
  model_id: string;
  spatial_discretization: ISpatialDiscretization | undefined;
  time_discretization: ITimeDiscretization | undefined;
  layers: ILayer[];
  boundaries: any
  observations: any
  transport: any
  variable_density: any
}

export type {IModel};
