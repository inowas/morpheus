import {IBoundaryType} from '../../../../types/Boundaries.type';


interface IAvailableBoundary {
  title: string;
  type: IBoundaryType;
  data_keys: string[];
  isTimeSeriesDependent: boolean;
  hasMultipleObservations: boolean;
  hasMultipleAffectedLayers: boolean;
  geometryType: 'Point' | 'LineString' | 'Polygon';
}

export const boundarySettings: IAvailableBoundary[] = [
  {
    title: 'Constant Head Boundaries',
    type: 'constant_head',
    data_keys: ['date_time', 'head'],
    isTimeSeriesDependent: true,
    hasMultipleAffectedLayers: true,
    hasMultipleObservations: true,
    geometryType: 'LineString',
  },
  {
    title: 'Drain Boundaries',
    type: 'drain',
    data_keys: ['date_time', 'stage', 'conductance'],
    isTimeSeriesDependent: true,
    hasMultipleAffectedLayers: false,
    hasMultipleObservations: true,
    geometryType: 'LineString',
  },
  {
    title: 'Evapotranspiration Boundaries',
    type: 'evapotranspiration',
    data_keys: ['date_time', 'surface_elevation', 'evapotranspiration'],
    isTimeSeriesDependent: false,
    hasMultipleAffectedLayers: true,
    hasMultipleObservations: false,
    geometryType: 'Polygon',
  },
  {
    title: 'Flow and Head Boundaries',
    type: 'flow_and_head',
    data_keys: ['date_time', 'flow', 'head'],
    isTimeSeriesDependent: false,
    hasMultipleAffectedLayers: true,
    hasMultipleObservations: true,
    geometryType: 'LineString',
  },
  {
    title: 'General Head Boundaries',
    type: 'general_head',
    data_keys: ['date_time', 'stage', 'conductance'],
    isTimeSeriesDependent: true,
    hasMultipleAffectedLayers: true,
    hasMultipleObservations: true,
    geometryType: 'LineString',
  },
  {
    title: 'Lake Boundaries',
    type: 'lake',
    data_keys: ['date_time', 'precipitation', 'evaporation', 'runoff', 'withdrawal'],
    isTimeSeriesDependent: true,
    hasMultipleAffectedLayers: false,
    hasMultipleObservations: false,
    geometryType: 'Polygon',
  },
  {
    title: 'Recharge',
    type: 'recharge',
    data_keys: ['date_time', 'recharge_rate'],
    isTimeSeriesDependent: true,
    hasMultipleAffectedLayers: false,
    hasMultipleObservations: false,
    geometryType: 'Polygon',
  },
  {
    title: 'River',
    type: 'river',
    data_keys: ['date_time', 'river_stage', 'riverbed_bottom', 'conductance'],
    isTimeSeriesDependent: false,
    hasMultipleAffectedLayers: true,
    hasMultipleObservations: true,
    geometryType: 'LineString',
  },
  {
    title: 'Well Boundaries',
    type: 'well',
    data_keys: ['date_time', 'pumping_rate'],
    isTimeSeriesDependent: true,
    hasMultipleAffectedLayers: false,
    hasMultipleObservations: false,
    geometryType: 'Point',
  },
];


export const getAvailableBoundary = (type: IBoundaryType): IAvailableBoundary | null => boundarySettings.find(b => b.type === type) || null;
export const getBoundarySettings = (): IAvailableBoundary[] => boundarySettings;
export const isTimeSeriesDependent = (type: IBoundaryType): boolean => getAvailableBoundary(type)?.isTimeSeriesDependent || false;
export const hasMultipleAffectedLayers = (type: IBoundaryType): boolean => getAvailableBoundary(type)?.hasMultipleAffectedLayers || false;
export const hasMultipleObservations = (type: IBoundaryType): boolean => getAvailableBoundary(type)?.hasMultipleObservations || false;
