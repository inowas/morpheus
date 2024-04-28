import {Point, Polygon} from 'geojson';
import {IAffectedCells, ILengthUnit, ITimeDiscretization} from '../types';
import {ILayerPropertyValues} from '../types/Layers.type';

export interface ICreateProjectCommand {
  command_name: 'create_project_command';
  payload: {
    name: string;
    description: string;
    tags: string[];
  }
}

export interface IDeleteProjectCommand {
  command_name: 'delete_project_command';
  payload: {
    project_id: string;
  }
}

export interface IUpdateProjectMetadataCommand {
  command_name: 'update_project_metadata_command';
  payload: {
    project_id: string;
    name: string;
    description: string;
    tags: string[];
  }
}

export interface IUpdateProjectVisibilityCommand {
  command_name: 'update_project_visibility_command';
  payload: {
    project_id: string;
    visibility: 'public' | 'private';
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

export interface IUpdateModelGeometryCommand {
  command_name: 'update_model_geometry_command';
  payload: {
    project_id: string;
    geometry: Polygon;
  }
}

export interface IUpdateModelGridCommand {
  command_name: 'update_model_grid_command';
  payload: {
    project_id: string;
    n_cols: number;
    n_rows: number;
    origin?: Point;
    col_widths?: number[];
    total_width?: number;
    row_heights?: number[];
    total_height?: number;
    rotation?: number;
    length_unit?: ILengthUnit;
  }
}

export interface IUpdateModelAffectedCellsCommand {
  command_name: 'update_model_affected_cells_command';
  payload: {
    project_id: string;
    affected_cells: IAffectedCells;
  }
}

export interface IUpdateModelTimeDiscretizationCommand {
  command_name: 'update_model_time_discretization_command';
  payload: {
    project_id: string;
    start_date_time: ITimeDiscretization['start_date_time'];
    end_date_time: ITimeDiscretization['end_date_time'];
    stress_periods: ITimeDiscretization['stress_periods'];
    time_unit: ITimeDiscretization['time_unit'];
  }
}

export interface ICloneModelLayerCommand {
  command_name: 'clone_model_layer_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
  }
}

export interface ICreateModelLayerCommand {
  command_name: 'create_model_layer_command';
  payload: {
    project_id: string;
    model_id: string;
    name: string;
    description: string;
    type: 'confined' | 'convertible' | 'unconfined';
    hk: number;
    hani: number;
    vka: number;
    specific_storage: number;
    specific_yield: number;
    initial_head: number;
    top?: number;
    bottom: number;
  }
}

export interface IDeleteModelLayerCommand {
  command_name: 'delete_model_layer_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
  }
}

export interface IUpdateModelLayerCommand {
  command_name: 'update_model_layer_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
    name?: string;
    description?: string;
    type?: 'confined' | 'convertible' | 'unconfined';
  }
}

export interface IUpdateModelLayerOrderCommand {
  command_name: 'update_model_layer_order_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_ids: string[];
  }
}

export interface IUpdateModelLayerPropertyCommand {
  command_name: 'update_model_layer_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
    property_name: 'hk' | 'hani' | 'vka' | 'specific_storage' | 'specific_yield' | 'initial_head' | 'top' | 'bottom';
    property_default_value: ILayerPropertyValues['value'];
    property_raster?: ILayerPropertyValues['raster'];
    property_zones?: ILayerPropertyValues['zones'];
  }
}

export interface ICreateModelVersionCommand {
  command_name: 'create_model_version_command';
  payload: {
    project_id: string;
    version_tag: string;
    version_description: string;
  }
}

export interface IDeleteModelVersionCommand {
  command_name: 'delete_model_version_command';
  payload: {
    project_id: string;
    version_id: string;
  }
}

export interface IUpdateModelVersionDescriptionCommand {
  command_name: 'update_model_version_description_command';
  payload: {
    project_id: string;
    version_id: string;
    version_description: string;
  }
}

export interface IAddProjectMemberCommand {
  command_name: 'add_project_member_command';
  payload: {
    project_id: string;
    new_member_id: string;
    new_member_role: 'viewer' | 'editor' | 'admin' | 'owner';
  }
}

export interface IRemoveProjectMemberCommand {
  command_name: 'remove_project_member_command';
  payload: {
    project_id: string;
    member_id: string;
  }
}

export interface IUpdateProjectMemberRoleCommand {
  command_name: 'update_project_member_role_command';
  payload: {
    project_id: string;
    member_id: string;
    new_role: 'viewer' | 'editor' | 'admin' | 'owner';
  }
}

export type ICommand =
  ICreateProjectCommand
  | IDeleteProjectCommand
  | IUpdateProjectMetadataCommand
  | IUpdateProjectVisibilityCommand
  | ICreateModelCommand
  | IUpdateModelGeometryCommand
  | IUpdateModelGridCommand
  | IUpdateModelAffectedCellsCommand
  | IUpdateModelTimeDiscretizationCommand
  | ICloneModelLayerCommand
  | ICreateModelLayerCommand
  | IDeleteModelLayerCommand
  | IUpdateModelLayerCommand
  | IUpdateModelLayerOrderCommand
  | IUpdateModelLayerPropertyCommand
  | ICreateModelVersionCommand
  | IDeleteModelVersionCommand
  | IUpdateModelVersionDescriptionCommand
  | IAddProjectMemberCommand
  | IRemoveProjectMemberCommand
  | IUpdateProjectMemberRoleCommand;
