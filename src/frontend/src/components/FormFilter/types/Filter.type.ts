export interface IFilterOptions {
  myModels: boolean;
  modelsFromGroups: boolean;
  calculationsFinalized: boolean;
  calculationsNotFinalized: boolean;
  selectedOwners: string[];
  boundaryValues: {
    [key: string]: boolean;
    CHD: boolean;
    FHB: boolean;
    WEL: boolean;
    RCH: boolean;
    RIV: boolean;
    GHB: boolean;
    EVT: boolean;
    DRN: boolean;
    NB: boolean;
  };
  additionalFeatures: {
    [key: string]: boolean;
    soluteTransportMT3DMS: boolean,
    dualDensityFlowSEAWAT: boolean,
    realTimeSensors: boolean,
    modelsWithScenarios: boolean,
  },
  selectedKeywords: string[];
  modifiedDate: boolean,
  createdDate: boolean,
  modelDate: boolean,
  fromDate: string,
  toDate: string,
  gridCellsValue: number
}
