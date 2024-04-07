import {Polygon} from 'geojson';

export interface ICreateProjectCommand {
  command_name: 'create_project_command';
  payload: {
    name: string;
    description: string;
    tags: string[];
  }
}

export interface ICreateModelCommand {
  command_name: 'create_model_command';
  payload: {
    project_id: string;
    geometry: Polygon;
    n_cols: number;
    n_rows: number;
    rotation: number;
  }
}
