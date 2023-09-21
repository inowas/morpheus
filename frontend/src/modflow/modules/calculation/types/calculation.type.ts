export interface ICalculation {
  calculation_id: string;
  state: number;
  message: string;
  files: string[];
  times: {
    start_date_time: string;
    time_unit: number;
    total_times?: number[];
    head: IAvailableValues;
    budget: IAvailableValues;
    concentration: IAvailableValues;
    drawdown: IAvailableValues;
  };
  layer_values: ILayerValues
}

interface IAvailableValues {
  idx: number[];
  total_times: number[];
  kstpkper: [number, number][];
  layers: ILayerValues;
}

type ILayerValues = ['head' | 'budget' | 'drawdown'][];
