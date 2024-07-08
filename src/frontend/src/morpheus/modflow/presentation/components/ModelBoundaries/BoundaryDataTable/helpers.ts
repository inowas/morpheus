import {IBoundaryObservationData, IBoundaryType} from '../../../../types/Boundaries.type';
import {IColumn} from './DataTable';

const isNotNullish = (value: any): value is number => null !== value && value !== undefined;
const formatNumberOrNull = (fractionDigits: number) => (value: number | null) => isNotNullish(value) ? value.toFixed(fractionDigits) : '-';
const parseNumber = (value: string) => parseFloat(value) as number;

type IFormatDate = (dateString: string) => string;

export const getBoundaryColumnsByType = (boundaryType: IBoundaryType, formatDate: IFormatDate, parseDate: IFormatDate): IColumn[] => {
  const defaultColumns: IColumn[] = [
    {
      title: 'Start date',
      key: 'date_time',
      format: (value: string) => formatDate(value),
      parse: (value: string) => parseDate(value),
      defaultValue: 0,
      inputType: 'date',
    }];

  switch (boundaryType) {
  case 'constant_head':
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
  case 'drain':
    return [...defaultColumns,
      {title: 'Stage', key: 'stage', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
      {title: 'Conductance', key: 'conductance', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
    ];
  case 'evapotranspiration':
    return [...defaultColumns,
      {title: 'Surface Elevation', key: 'surface_elevation', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
      {title: 'Evapotranspiration', key: 'evapotranspiration', format: formatNumberOrNull(4), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 4},
      {title: 'Extinction Depth', key: 'extinction_depth', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
    ];
  case 'flow_and_head':
    return [...defaultColumns,
      {title: 'Flow', key: 'flow', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
      {title: 'Head', key: 'head', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
    ];
  case 'general_head':
    return [...defaultColumns,
      {title: 'Stage', key: 'stage', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
      {title: 'Conductance', key: 'conductance', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
    ];
  case 'lake':
    return [...defaultColumns,
      {title: 'Precipitation', key: 'precipitation', format: formatNumberOrNull(4), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 4},
      {title: 'Evaporation', key: 'evaporation', format: formatNumberOrNull(4), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 4},
      {title: 'Runoff', key: 'runoff', format: formatNumberOrNull(4), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 4},
      {title: 'Withdrawal', key: 'withdrawal', format: formatNumberOrNull(4), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 4},
    ];
  case 'recharge':
    return [...defaultColumns,
      {title: 'Recharge rate', key: 'recharge_rate', format: formatNumberOrNull(4), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 4},
    ];
  case 'river':
    return [...defaultColumns,
      {title: 'River Stage', key: 'river_stage', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
      {title: 'Riverbed Bottom', key: 'riverbed_bottom', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
      {title: 'Conductance', key: 'conductance', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'number', precision: 2},
    ];
  case 'well':
    return [...defaultColumns,
      {title: 'Pumping Rate', key: 'pumping_rate', format: formatNumberOrNull(2), parse: parseNumber, defaultValue: 0, inputType: 'text'},
    ];
  default:
    return defaultColumns;
  }
};

export const getNewBoundaryDataItemByType = (boundaryType: IBoundaryType, dateString: string): IBoundaryObservationData => {
  switch (boundaryType) {
  case 'constant_head':
    return {date_time: dateString, head: 0};
  case 'drain':
    return {date_time: dateString, stage: 0, conductance: 0};
  case 'evapotranspiration':
    return {date_time: dateString, surface_elevation: 0, evapotranspiration: 0, extinction_depth: 0};
  case 'flow_and_head':
    return {date_time: dateString, flow: 0, head: 0};
  case 'general_head':
    return {date_time: dateString, stage: 0, conductance: 0};
  case 'lake':
    return {date_time: dateString, precipitation: 0, evaporation: 0, runoff: 0, withdrawal: 0};
  case 'recharge':
    return {date_time: dateString, recharge_rate: 0};
  case 'river':
    return {date_time: dateString, river_stage: 0, riverbed_bottom: 0, conductance: 0};
  case 'well':
    return {date_time: dateString, pumping_rate: 0};
  }
};

