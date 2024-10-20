import {LineString, Point, Polygon} from 'geojson';
import {IAffectedCells, ILengthUnit, ITimeDiscretization} from '../types';
import {ILayerId, ILayerProperty, IZone} from '../types/Layers.type';
import {IBoundaryObservationValue, IBoundaryType, IInterpolationType, IObservationId} from '../types/Boundaries.type';
import {ICalculationProfile} from '../types/CalculationProfile.type';
import {IObservationValue} from '../types/Observations.type';
import {IImportItem} from '../types/Import.type';

// Asset Commands
export interface IDeleteAssetCommand {
  command_name: 'delete_asset_command';
  payload: {
    project_id: string;
    asset_id: string;
  }
}

export interface IUpdateAssetDescriptionCommand {
  command_name: 'update_asset_description_command';
  payload: {
    project_id: string;
    asset_id: string;
    asset_description: string;
  }
}

export interface IUpdateAssetFileNameCommand {
  command_name: 'update_asset_file_name_command';
  payload: {
    project_id: string;
    asset_id: string;
    asset_file_name: string;
  }
}

export interface IUpdateRasterAssetNoDataValueCommand {
  command_name: 'update_raster_asset_no_data_value_command';
  payload: {
    project_id: string;
    asset_id: string;
    no_data_value: number;
  }
}

export type IAssetCommand = IDeleteAssetCommand |
  IUpdateAssetDescriptionCommand |
  IUpdateAssetFileNameCommand |
  IUpdateRasterAssetNoDataValueCommand;


// Calculation Commands
export interface IStartCalculationCommand {
  command_name: 'start_calculation_command';
  payload: {
    project_id: string;
    model_id: string;
  }
}

export interface IStopCalculationCommand {
  command_name: 'stop_calculation_command';
  payload: {
    project_id: string;
    calculation_id: string;
  }
}

export interface IDeleteCalculationCommand {
  command_name: 'delete_calculation_command';
  payload: {
    project_id: string;
    calculation_id: string;
  }
}

export interface IUpdateCalculationProfileCommand {
  command_name: 'update_calculation_profile_command';
  payload: {
    project_id: string;
    calculation_profile_id: string;
    calculation_profile: ICalculationProfile;
  }
}

type ICalculationCommand = IStartCalculationCommand | IStopCalculationCommand | IDeleteCalculationCommand | IUpdateCalculationProfileCommand;


// Model Boundary Commands
export interface IAddModelBoundaryCommand {
  command_name: 'add_model_boundary_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_type: IBoundaryType;
    boundary_geometry: Point | LineString | Polygon;
  }
}

export interface IAddModelBoundaryObservationCommand {
  command_name: 'add_model_boundary_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
    observation_name: string;
    observation_geometry: Point;
    observation_data: IBoundaryObservationValue[]
  }
}

export interface ICloneModelBoundaryCommand {
  command_name: 'clone_model_boundary_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
  }
}

export interface ICloneModelBoundaryObservationCommand {
  command_name: 'clone_model_boundary_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
    observation_id: string;
  }
}

export interface IDisableModelBoundaryCommand {
  command_name: 'disable_model_boundary_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
  }
}

export interface IEnableModelBoundaryCommand {
  command_name: 'enable_model_boundary_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
  }
}

export interface IImportModelBoundariesCommand {
  command_name: 'import_model_boundaries_command';
  payload: {
    project_id: string;
    model_id: string;
    boundaries: IImportItem[]
  }
}

export interface IRemoveModelBoundaryCommand {
  command_name: 'remove_model_boundary_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
  }
}

export interface IRemoveModelBoundaryObservationCommand {
  command_name: 'remove_model_boundary_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
    observation_id: string;
  }
}

export interface IUpdateModelBoundaryAffectedCellsCommand {
  command_name: 'update_model_boundary_affected_cells_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
    affected_cells: IAffectedCells;
  }
}

export interface IUpdateModelBoundaryAffectedLayersCommand {
  command_name: 'update_model_boundary_affected_layers_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
    affected_layers: ILayerId[];
  }
}

export interface IUpdateModelBoundaryGeometryCommand {
  command_name: 'update_model_boundary_geometry_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
    geometry: Point | LineString | Polygon;
  }
}

export interface IUpdateModelBoundaryInterpolationCommand {
  command_name: 'update_model_boundary_interpolation_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
    interpolation: IInterpolationType;
  }
}

export interface IUpdateModelBoundaryMetadataCommand {
  command_name: 'update_model_boundary_metadata_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id?: string;
    boundary_name?: string;
    boundary_tags?: string[];
  }
}

export interface IUpdateModelBoundaryObservationCommand {
  command_name: 'update_model_boundary_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    boundary_id: string;
    boundary_type: IBoundaryType;
    observation_id: IObservationId;
    observation_name: string;
    observation_geometry: Point;
    observation_data: IBoundaryObservationValue[];
  }
}

export type IModelBoundaryCommand = IAddModelBoundaryCommand |
  IAddModelBoundaryObservationCommand |
  ICloneModelBoundaryCommand |
  ICloneModelBoundaryObservationCommand |
  IDisableModelBoundaryCommand |
  IEnableModelBoundaryCommand |
  IImportModelBoundariesCommand |
  IRemoveModelBoundaryCommand |
  IRemoveModelBoundaryObservationCommand |
  IUpdateModelBoundaryAffectedCellsCommand |
  IUpdateModelBoundaryAffectedLayersCommand |
  IUpdateModelBoundaryGeometryCommand |
  IUpdateModelBoundaryInterpolationCommand |
  IUpdateModelBoundaryMetadataCommand |
  IUpdateModelBoundaryObservationCommand;


// Model Discretization Commands
export interface IUpdateModelAffectedCellsCommand {
  command_name: 'update_model_affected_cells_command';
  payload: {
    project_id: string;
    affected_cells: IAffectedCells;
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

export type IModelDiscretizationCommand = IUpdateModelAffectedCellsCommand |
  IUpdateModelGeometryCommand |
  IUpdateModelGridCommand |
  IUpdateModelTimeDiscretizationCommand;


// General Model Commands
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

export type IGeneralModelCommand = ICreateModelCommand | ICreateModelVersionCommand | IDeleteModelVersionCommand | IUpdateModelVersionDescriptionCommand;

// Model Observation Commands
export interface IAddModelObservationCommand {
  command_name: 'add_model_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    type: 'head';
    geometry: Point;
  }
}

export interface ICloneModelObservationCommand {
  command_name: 'clone_model_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    observation_id: string;
  }
}

export interface IDisableModelObservationCommand {
  command_name: 'disable_model_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    observation_id: string;
  }
}

export interface IEnableModelObservationCommand {
  command_name: 'enable_model_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    observation_id: string;
  }
}

export interface IRemoveModelObservationCommand {
  command_name: 'remove_model_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    observation_id: string;
  }
}

export interface IUpdateModelObservationCommand {
  command_name: 'update_model_observation_command';
  payload: {
    project_id: string;
    model_id: string;
    observation_id: string;
    type: 'head';
    name: string;
    tags: string[];
    geometry: Point;
    affected_cells: IAffectedCells;
    affected_layers: ILayerId[];
    data: IObservationValue[];
    enabled: boolean;
  }
}

export type IModelObservationCommand = IAddModelObservationCommand |
  ICloneModelObservationCommand |
  IDisableModelObservationCommand |
  IEnableModelObservationCommand |
  IRemoveModelObservationCommand |
  IUpdateModelObservationCommand;

// Model Layer Commands
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
    confinement: 'confined' | 'convertible' | 'unconfined';
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

export interface IUpdateModelLayerConfinementCommand {
  command_name: 'update_model_layer_confinement_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
    confinement: 'confined' | 'convertible' | 'unconfined';
  }
}

export interface IUpdateModelLayerMetadataCommand {
  command_name: 'update_model_layer_metadata_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
    name?: string;
    description?: string;
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

export interface IUpdateModelLayerPropertyDefaultValueCommand {
  command_name: 'update_model_layer_property_default_value_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
    property_name: ILayerProperty;
    property_default_value: number;
  }
}

export interface IUpdateModelLayerPropertyRasterReferenceCommand {
  command_name: 'update_model_layer_property_raster_reference_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
    property_name: ILayerProperty;
    property_raster_reference: {
      asset_id: string;
      band: number;
    } | null;
  }
}

export interface IUpdateModelLayerPropertyZonesCommand {
  command_name: 'update_model_layer_property_zones_command';
  payload: {
    project_id: string;
    model_id: string;
    layer_id: string;
    property_name: ILayerProperty;
    property_zones: IZone[] | null;
  }
}

export type IModelLayerCommand = ICloneModelLayerCommand |
  ICreateModelLayerCommand |
  IDeleteModelLayerCommand |
  IUpdateModelLayerConfinementCommand |
  IUpdateModelLayerMetadataCommand |
  IUpdateModelLayerOrderCommand |
  IUpdateModelLayerPropertyDefaultValueCommand |
  IUpdateModelLayerPropertyRasterReferenceCommand |
  IUpdateModelLayerPropertyZonesCommand;

// All Model Commands
export type IModelCommand = IModelBoundaryCommand | IModelDiscretizationCommand | IGeneralModelCommand | IModelObservationCommand | IModelLayerCommand;

// Project Commands
export interface IAddProjectMemberCommand {
  command_name: 'add_project_member_command';
  payload: {
    project_id: string;
    new_member_id: string;
    new_member_role: 'viewer' | 'editor' | 'admin' | 'owner';
  }
}

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

export type IProjectCommand = IAddProjectMemberCommand |
  ICreateProjectCommand |
  IDeleteProjectCommand |
  IRemoveProjectMemberCommand |
  IUpdateProjectMemberRoleCommand |
  IUpdateProjectMetadataCommand |
  IUpdateProjectVisibilityCommand;


export type ICommand = IAssetCommand | ICalculationCommand | IModelCommand | IProjectCommand;
