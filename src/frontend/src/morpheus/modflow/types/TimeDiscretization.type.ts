export interface ITimeDiscretization {
  startDateTime: string;
  endDateTime: string;
  timeUnit: ITimeUnit;
  stressPeriods: IStressPeriod[];
}

export interface IStressPeriod {
  startDateTime: string;
  numberOfTimeSteps: number;
  timeStepMultiplier: number;
  steadyState: boolean;
}

export enum ITimeUnit {
  UNDEFINED = 0,
  SECONDS = 1,
  MINUTES = 2,
  HOURS = 3,
  DAYS = 4,
  YEARS = 5,
}
