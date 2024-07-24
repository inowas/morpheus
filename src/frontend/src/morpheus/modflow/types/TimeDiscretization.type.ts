export interface ITimeDiscretization {
  start_date_time: string;
  end_date_time: string;
  time_unit: ITimeUnit;
  stress_periods: IStressPeriod[];
}

export interface IStressPeriod {
  start_date_time: string;
  number_of_time_steps: number;
  time_step_multiplier: number;
  steady_state: boolean;
}

export enum ITimeUnit {
  SECONDS = 'seconds',
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  YEARS = 'years',
}
