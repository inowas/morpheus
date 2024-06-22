interface ICalculationProfile {
  id: string;
  name: string;
  engine_type: 'mf2005';
  engine_settings: {
    available_solver_packages: string[];
    selected_solver_package: string;
    available_flow_packages: string[];
    selected_flow_package: string;
    bas: IBasPackageSettings,
    bcf: IBcfPackageSettings,
    chd: IChdPackageSettings,
    de4: IDe4PackageSettings,
    dis: IDisPackageSettings,
    drn: IDrnPackageSettings,
    evt: IEvtPackageSettings
    fhb: IFhbPackageSettings
    ghb: IGhbPackageSettings
    gmg: IGmgPackageSettings
    hob: IHobPackageSettings
    lak: ILakPackageSettings
    lpf: ILpfPackageSettings
    mf: IMfPackageSettings
    oc: IOcPackageSettings
    pcg: IPcgPackageSettings
    pcgn: IPcgnPackageSettings
    rch: IRchPackageSettings
    riv: IRivPackageSettings
    sip: ISipPackageSettings
    wel: IWelPackageSettings
  }
}

interface IBasPackageSettings {
  ichflg: boolean;
  hnoflo: number;
  stoper: number | null;
}

interface IBcfPackageSettings {
  ipakcb: number;
  iwdflg: number;
  ihdwet: number;
  wetfct: number;
  iwetit: number;
  wetdry: number;
  hdry: number;
}

interface IChdPackageSettings {
  laycbd: boolean;
}

interface IDe4PackageSettings {
  itmx: number;
  mxup: number;
  mxlow: number;
  mxbw: number;
  ifreq: number;
  mutd4: number;
  accl: number;
  hclose: number;
  iprd4: number;
}

interface IDisPackageSettings {
}

interface IDrnPackageSettings {
  ipakcb: number;
}

interface IEvtPackageSettings {
  ipakcb: number;
  nevtop: number;
}

interface IFhbPackageSettings {
  ipakcb: number;
  ifhbss: number;
  ifhbpt: number;
}

interface IGhbPackageSettings {
  ipakcb: number;
}

interface IGmgPackageSettings {
  mxiter: number;
  iiter: number;
  iadamp: number;
  hclose: number;
  rclose: number;
  relax: number;
  ioutgmg: number;
  iunitmhc: number;
  ism: number;
  isc: number;
  damp: number;
  dup: number;
  dlow: number;
  chglimit: number;
}

interface IHobPackageSettings {
  hobdry: number;
  tomulth: number;
}

interface ILakPackageSettings {
  ipakcb: number;
  theta: number;
}

interface ILpfPackageSettings {
  ipakcb: number;
  iwdflg: number;
  ihdwet: number;
  wetfct: number;
  iwetit: number;
  wetdry: number;
  hdry: number;
  storagecoefficient: boolean;
  nocvcorrection: boolean;
  constantcv: boolean;
  novfc: boolean;
  thickstrt: boolean;
}

interface IMfPackageSettings {
  verbose: boolean;
}

interface IOcPackageSettings {
  ihedfm: number;
  iddnfm: number;
  chedfm: number | null;
  cddnfm: number | null;
  cboufm: number | null;
  compact: boolean;
  label: string;
}

interface IPcgPackageSettings {
  mxiter: number;
  iter1: number;
  npcond: number;
  hclose: number;
  rclose: number;
  relax: number;
  nbpol: number;
  iprpcg: number;
  mutpcg: number;
  damp: number;
  dampt: number;
  ihcofadd: number;
}

interface IPcgnPackageSettings {
  iter_mo: number;
  iter_mi: number;
  close_r: number;
  close_h: number;
  relax: number;
  ifill: number;
  unit_pc: number;
  unit_ts: number;
  adamp: number;
  damp: number;
  damp_lb: number;
  rate_d: number;
  chglimit: number;
  acnvg: number;
  cnvg_lb: number;
  mcnvg: number;
  rate_c: number;
  ipunit: number;
}

interface IRchPackageSettings {
  ipakcb: number;
}

interface IRivPackageSettings {
  ipakcb: number;
}

interface ISipPackageSettings {
  mxiter: number;
  nparm: number;
  accl: number;
  hclose: number;
  ipcalc: number;
  wseed: number;
  iprsip: number;
}

interface IWelPackageSettings {
  ipakcb: number;
}


export type {
  ICalculationProfile,
  IBasPackageSettings,
  IBcfPackageSettings,
  IChdPackageSettings,
  IDe4PackageSettings,
  IDisPackageSettings,
  IDrnPackageSettings,
  IEvtPackageSettings,
  IFhbPackageSettings,
  IGhbPackageSettings,
  IGmgPackageSettings,
  IHobPackageSettings,
  ILakPackageSettings,
  ILpfPackageSettings,
  IMfPackageSettings,
  IOcPackageSettings,
  IPcgPackageSettings,
  IPcgnPackageSettings,
  IRchPackageSettings,
  IRivPackageSettings,
  ISipPackageSettings,
  IWelPackageSettings,
};
