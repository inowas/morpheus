// TODO: This type is old and should be replaced with ITimeDiscretization
export interface IStressperiodParams {
  stressperiod: StressperiodDataType;
  startDate: null | string;
  endDate: string;
  timeUnit: string;
}

export type StressperiodDataType = any;

export interface ITimeDiscretization {
  startDateTime: string;
  endDateTime: string;
  timeUnit: number;
  stressPeriods: IStressPeriod[];
}

export interface IStressPeriod {
  startDateTime: string;
  numberOfTimeSteps: number;
  timeStepMultiplier: number;
  steadyState: boolean;
}
