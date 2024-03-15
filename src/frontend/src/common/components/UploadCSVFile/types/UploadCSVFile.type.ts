export type TColumns = Array<{ key: number; value: string; text: string; type?: ECsvColumnType }>;

export enum ECsvColumnType {
  BOOLEAN = 'boolean',
  DATE_TIME = 'date_time',
  NUMBER = 'number',
}

export interface IProps {
  onSave: (data: any) => void
  onCancel: () => void;
  columns: TColumns;
}
