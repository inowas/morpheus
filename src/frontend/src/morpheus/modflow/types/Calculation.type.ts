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
  flow_head_results: IAvailableResult;
  flow_drawdown_results: IAvailableResult;
  flow_budget_results: IAvailableResult;
  transport_concentration_results: IAvailableResult;
  transport_budget_results: IAvailableResult;
  packages: string[];
}

interface IAvailableResult {
  times: number[];
  kstpkper: [number, number][];
  number_of_layers: number;
  number_of_observations: number;
}


export type {ICalculation, ICalculationId, ICalculationState, ICalculationResult, ICalculationResultType, IAvailableResult};
