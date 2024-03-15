// TODO: This type is old and should be replaced with ITimeDiscretization
export interface IStressperiodParams {
  stressperiod: StressperiodDataType;
  startDate: null | string;
  endDate: string;
  timeUnit: string;
}

export type StressperiodDataType = any;

export interface ITimeDiscretization {
  start_date_time: string;
  end_date_time: string;
  time_unit: number;
  stress_periods: IStressPeriod[];
}

export interface IStressPeriod {
  start_date_time: string;
  number_of_time_steps: number;
  time_step_multiplier: number;
  steady_state: boolean;
}


