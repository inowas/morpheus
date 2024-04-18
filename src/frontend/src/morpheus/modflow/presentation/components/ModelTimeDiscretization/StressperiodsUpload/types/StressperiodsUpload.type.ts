export interface IColumn {
  value: string;
  text: string;
  type: ECsvColumnType,
  default: string | number | boolean;
}

export enum ECsvColumnType {
  BOOLEAN = 'boolean',
  DATE_TIME = 'date_time',
  FLOAT = 'float',
  INTEGER = 'integer',
}
