interface ICalculation {
  calculation_id: ICalculationId;
  model_id: string;
  profile_id: string;
  lifecycle: ICalculationState[];
  state: ICalculationState;
  check_model_log: string[] | null;
  calculation_log: string[] | null;
  result: ICalculationResult | null;
}

type ICalculationId = string;

type ICalculationState = 'created' | 'queued' | 'preprocessing' | 'preprocessed' | 'calculating' | 'completed' | 'canceled' | 'failed';

type ICalculationResultType = 'success' | 'failure';

interface ICalculationResult {
  type: ICalculationResultType;
  message: string;
  files: string[];
  flow_head_results: IAvailableResults;
  flow_drawdown_results: IAvailableResults | null;
  flow_budget_results: IAvailableResults | null;
  transport_concentration_results: IAvailableResults | null;
  transport_budget_results: IAvailableResults | null;
  packages: string[];
}

interface IAvailableResults {
  times: number[];
  kstpkper: [number, number][];
  number_of_layers: number;
  number_of_observations: number;
  min_value: number | null;
  max_value: number | null;
}


export type {ICalculation, ICalculationId, ICalculationState, ICalculationResult, ICalculationResultType, IAvailableResults};
