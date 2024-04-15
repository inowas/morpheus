export type TColumns = Array<{ key: number; value: string; text: string; type?: ECsvColumnType }>;

export enum ECsvColumnType {
  BOOLEAN = 'boolean',
  DATE_TIME = 'date_time',
  NUMBER = 'number',
}
