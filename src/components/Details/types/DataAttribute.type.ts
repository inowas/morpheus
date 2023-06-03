export interface IDetailsAttribute {
  fieldKey: string;
  label: string;
  type: AttributeType;
  form_group: string;
  validate?: (value: any) => undefined | string;
}

export type AttributeType = 'string' | 'number' | 'currency' | 'boolean' | 'date' | 'file';
