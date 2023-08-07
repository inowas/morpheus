type IInputType = 'SLIDER' | 'NUMBER' | 'RADIO_SELECT' | 'SELECT_NAME';

export const SETTINGS_SELECTED_NOTHING: number = 1;
export const SETTINGS_SELECTED_H0: number = 2;
export const SETTINGS_SELECTED_HL: number = 3;

export interface ICalculateDiagramDataT13 {
  w: number;
  K: number;
  ne: number;
  L: number;
  hL: number;
  xMin: number;
  xMax: number;
  dX: number;
}

export interface ICalculateDiagramDataT13B {
  w: number;
  K: number;
  ne: number;
  L1: number;
  h1: number;
  xMin: number;
  xMax: number;
  dX: number;
}

export interface ICalculateDiagramDataT13E {
  Qw: number;
  ne: number;
  hL: number;
  h0: number;
  x: number;
  xi: number;
}

export interface IParameter {
  decimals: number;
  id: string;
  inputType: IInputType;
  label: string;
  min: number;
  max: number;
  name: string;
  order: number;
  stepSize: number;
  type: string,
  validMax?: (value: number) => boolean;
  validMin?: (value: number) => boolean;
  value: number;
  parseValue: (value: string) => number;
}

export interface IT13A {
  parameters: IParameter[];
}

export interface IT13B {
  parameters: IParameter[];
  settings: {
    selected: number;
  };
}

export interface IT13C {
  parameters: IParameter[];
}

export interface IT13D {
  parameters: IParameter[];
}

export interface IT13E {
  parameters: IParameter[];
}


