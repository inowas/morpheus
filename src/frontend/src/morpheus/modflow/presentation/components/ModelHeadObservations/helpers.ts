import {IObservationType, IObservationValue} from '../../../types/Observations.type';
import {IColumn} from '../../../types/DataTable.type';

const isNotNullish = (value: any): value is number => null !== value && value !== undefined;
const formatNumberOrNull = (fractionDigits: number) => (value: number | null) => isNotNullish(value) ? value.toFixed(fractionDigits) : '-';
const parseNumber = (value: string) => parseFloat(value) as number;

type IFormatDate = (dateString: string) => string;

export const getObservationColumnsByType = (type: IObservationType, formatDate: IFormatDate, parseDate: IFormatDate): IColumn[] => {
  const defaultColumns: IColumn[] = [{
    title: 'Start date',
    key: 'date_time',
    format: (value: string) => formatDate(value),
    parse: (value: string) => parseDate(value),
    defaultValue: 0,
    inputType: 'date',
  }];

  switch (type) {
  case 'head':
    return [...defaultColumns,
      {
        title: 'Head',
        key: 'head',
        format: formatNumberOrNull(2), parse: parseNumber,
        defaultValue: 0,
        inputType: 'number',
        precision: 2,
      },
    ];
  default:
    return defaultColumns;
  }
};

export const getNewObservationDataItemByType = (type: IObservationType, dateString: string): IObservationValue => {
  switch (type) {
  case 'head':
    return {date_time: dateString, head: 0};
  }
};

export const isObservationType = (type: string): type is IObservationType => ['head'].includes(type);
