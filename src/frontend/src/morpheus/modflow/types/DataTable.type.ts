export interface IColumn {
  title: string;
  key: string;
  format: (value: any) => string;
  parse: (value: string) => any;
  defaultValue: number;
  inputType: 'text' | 'number' | 'date' | 'datetime-local';
  precision?: number;
}
