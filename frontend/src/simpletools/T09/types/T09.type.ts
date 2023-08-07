type IInputType = 'SLIDER' | 'NUMBER' | 'RADIO_SELECT' | 'SELECT_NAME';

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

export interface IT09A {
  parameters: IParameter[];
}

export interface IT09B {
  parameters: IParameter[];
}

export interface IT09C {
  parameters: IParameter[];
}

export interface IT09D {
  parameters: IParameter[];
  settings: {
    AqType: string;
  };
}

export interface IT09E {
  parameters: IParameter[];
  settings: {
    method: 'constHead' | 'constFlux';
  };
}

export interface IT09F {
  parameters: IParameter[];
}
