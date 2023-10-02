type IInputType = 'SLIDER' | 'NUMBER' | 'RADIO_SELECT' | 'SELECT_NAME';

export interface IT02 {
  settings: {
    variable: string
  },
  parameters: {
    decimals: number;
    id: string;
    inputType: IInputType;
    label: string;
    max: number;
    min: number;
    name: string;
    order: number;
    stepSize: number;
    type: string;
    validMax?: (value: number) => boolean;
    validMin?: (value: number) => boolean;
    value: number;
    parseValue: (value: string) => number;
  }[]
}
