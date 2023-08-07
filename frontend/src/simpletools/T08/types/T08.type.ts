type IInputType = 'SLIDER' | 'NUMBER' | 'RADIO_SELECT' | 'SELECT_NAME';

export interface IT08 {
  id: string;
  name: string;
  description: string;
  permissions: string;
  public: boolean;
  tool: string;
  data: {
    parameters: {
      order: number;
      id: string;
      name: string;
      min: number;
      max: number;
      value: number;
      stepSize: number;
      type: string;
      decimals: number;
      inputType: IInputType;
      label: string;
      parseValue: (value: string) => number;
    }[];
    settings: {
      retardation: boolean;
      case: number;
      infiltration: number;
    };
  };
}

