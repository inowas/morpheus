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

export interface IT14A {
  parameters: IParameter[];
}

export interface IT14B {
  parameters: IParameter[];
}

export interface IT14C {
  parameters: IParameter[];
}

export interface IT14D {
  parameters: IParameter[];
}


