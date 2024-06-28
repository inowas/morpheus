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
  flow_drawdown_results: IAvailableResults;
  flow_budget_results: IAvailableResults;
  transport_concentration_results: IAvailableResults;
  transport_budget_results: IAvailableResults;
  packages: string[];
}

interface IAvailableResults {
  times: number[];
  kstpkper: [number, number][];
  number_of_layers: number;
  number_of_observations: number;
}


export type {ICalculation, ICalculationId, ICalculationState, ICalculationResult, ICalculationResultType, IAvailableResults};
