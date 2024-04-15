import {ISpatialDiscretization} from './SpatialDiscretization.type';
import {ITimeDiscretization} from './TimeDiscretization.type';

interface IModel {
  model_id: string;
  spatial_discretization: ISpatialDiscretization | undefined;
  time_discretization: ITimeDiscretization | undefined;
  boundaries: any
  observations: any
  soil_model: any
  transport: any
  variable_density: any
}

export type {IModel};
