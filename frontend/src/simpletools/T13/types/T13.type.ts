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

export interface IT13A {
  parameters: {
    order: number;
    id: string;
    name: string;
    min: number;
    max: number;
    value: number;
    stepSize: number;
    decimals: number;
    inputType: IInputType;
    label: string;
    parseValue: (value: string) => number;
    type: string,
  }[];
}

export interface IT13B {
  parameters: {
    order: number;
    id: string;
    name: string;
    min: number;
    max: number;
    value: number;
    stepSize: number;
    decimals: number;
    disable?: boolean;
    inputType: IInputType;
    label: string;
    parseValue: (value: string) => number;
    type: string,
  }[];
  settings: {
    selected: number;
  };
}

export interface IT13C {
  parameters: {
    order: number;
    id: string;
    name: string;
    min: number;
    max: number;
    value: number;
    stepSize: number;
    decimals: number;
    inputType: IInputType;
    label: string;
    parseValue: (value: string) => number;
    type: string,
  }[];
}

export interface IT13D {
  parameters: {
    order: number;
    id: string;
    name: string;
    min: number;
    max: number;
    value: number;
    stepSize: number;
    decimals: number;
    disable?: boolean;
    inputType: IInputType;
    label: string;
    parseValue: (value: string) => number;
    type: string,
  }[];
}

export interface IT13E {
  parameters: {
    order: number;
    id: string;
    name: string;
    min: number;
    max: number;
    value: number;
    stepSize: number;
    decimals: number;
    disable?: boolean;
    inputType: IInputType;
    label: string;
    parseValue: (value: string) => number;
    type: string,
  }[];
}

