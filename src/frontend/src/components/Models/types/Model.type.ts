export type StressperiodDataType = {
  key: string;
  start_date_time: string;
  nstp: number;
  tsmult: number;
  steady: boolean;
};


export interface IStressperiodParams {
  stressperiod: [] | StressperiodDataType[];
  startDate: null | string;
  endDate: string;
  timeUnit: string;
}
