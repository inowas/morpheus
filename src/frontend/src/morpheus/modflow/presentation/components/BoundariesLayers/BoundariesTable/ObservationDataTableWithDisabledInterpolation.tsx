import React, {useEffect, useState} from 'react';
import DataTable, {IColumn} from './DataTable';
import {IBoundaryObservationData, IBoundaryType, IInterpolationType, IObservation} from '../../../../types/Boundaries.type';
import {useDateTimeFormat} from 'common/hooks';
import {Checkbox, Icon, Popup, SemanticWIDTHS, Table, TableBody, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import BoundariesUpload from '../BoundariesUpload/BoundariesUpload';
import {ITimeDiscretization} from '../../../../types';
import {Button} from '../../../../../../common/components';
import DataTableInput from './DataTableInput';
import cloneDeep from 'lodash.clonedeep';

interface IProps {
  boundaryType: IBoundaryType;
  observation: IObservation<any>;
  onChangeObservation: (observation: IObservation<any>) => void;
  interpolation: IInterpolationType;
  timeDiscretization: ITimeDiscretization;
  isReadOnly: boolean;
}

type IFormatDate = (dateString: string) => string;

type IBoundaryObservationDataEnabled = IBoundaryObservationData & { enabled: boolean, [key: string]: any };

const isNotNullish = (value: any): value is number => null !== value && value !== undefined;
const formatNumberOrNull = (fractionDigits: number) => (value: number | null) => isNotNullish(value) ? value.toFixed(fractionDigits) : '-';
const parseNumber = (value: string) => parseFloat(value) as number;

const getColumns = (boundaryType: IBoundaryType, formatDate: IFormatDate, parseDate: IFormatDate): IColumn[] => {
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

const newRow = (boundaryType: IBoundaryType, dateString: string): IBoundaryObservationData => {
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

const ObservationDataTable = ({boundaryType, observation, onChangeObservation, interpolation, timeDiscretization, isReadOnly}: IProps) => {

  const {formatISODate, parseDate, addDays, addWeeks, addMonths, addYears} = useDateTimeFormat('UTC');
  const [data, setData] = useState<IBoundaryObservationDataEnabled[]>(observation.data || []);

  useEffect(() => {
    const observationData = timeDiscretization.stress_periods.map((sp, spIdx) => {
      const dataSet = observation.data.find((d) => d.date_time === sp.start_date_time);
      if (dataSet) {
        return {enabled: true, ...dataSet};
      }

      if (!dataSet && 0 === spIdx) {
        return {enabled: true, ...newRow(boundaryType, sp.start_date_time)};
      }

      return {enabled: false, ...newRow(boundaryType, sp.start_date_time)};
    });

    setData(observationData);
  }, [observation.data]);

  const updateDataPoint = (dataPoint: IBoundaryObservationDataEnabled) => {
    const new_data = data.map((d) => d.date_time === dataPoint.date_time ? dataPoint : d);
    setData(new_data);
  };

  const handleChangedData = (newData: { [key: string]: any; }[]) => {
    setData(newData as IBoundaryObservationDataEnabled[]);
  };

  const mapData = (data: IBoundaryObservationDataEnabled[]): IBoundaryObservationData[] => {
    return data.filter((d) => d.enabled)
      .map((d) => {
        const {enabled, ...rest} = d;
        return rest;
      });
  };

  const handleSubmit = () => onChangeObservation({...observation, data: mapData(data)});

  const columns = getColumns(boundaryType, formatISODate, parseDate);

  return (
    <>
      <BoundariesUpload
        onSubmit={() => console.log('Submit from ObservationDataTable')}
        columns={columns}
      />
      <Table celled={true} striped={true}>
        <TableHeader>
          <TableRow textAlign={'center'}>
            <TableHeaderCell textAlign={'left'}>No</TableHeaderCell>
            {columns.map((column, idx) => (
              <TableHeaderCell className='field' key={idx}>
                <Popup
                  trigger={<Icon
                    name="info circle"
                  />}
                  content={column.title}
                  hideOnScroll={true}
                  size="tiny"
                />
                {column.title}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowId) => (
            <TableRow key={rowId} disabled={!row.enabled}>
              <Table.Cell>
                <div>
                  <span>{rowId + 1}</span>
                </div>
                <div>
                  <Checkbox
                    disabled={isReadOnly}
                    toggle={true}
                    checked={row.enabled}
                    style={{pointerEvents: 'all', marginLeft: 10}}
                    onChange={(e, {checked}) => {
                      const newData = [...data];
                      newData[rowId].enabled = checked || false;
                      setData(newData);
                    }}
                  />
                </div>
              </Table.Cell>
              {columns.map((column, idx) => (
                <Table.Cell
                  key={idx}
                  disabled={!row.enabled}
                  textAlign={'center'}
                >
                  {'date_time' === column.key && column.format(row[column.key])}
                  {'date_time' !== column.key && <DataTableInput
                    isDisabled={!row.enabled}
                    value={column.format(row[column.key])}
                    isReadOnly={isReadOnly}
                    onChange={(value) => {
                      const newData = cloneDeep(data);
                      newData[rowId][column.key] = column.parse(value);
                      setData(newData);
                    }}
                  />}
                </Table.Cell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isReadOnly && <Button
        onClick={handleSubmit}
        disabled={JSON.stringify(observation.data) === JSON.stringify(mapData(data))}
        content={'Submit'}
      />}
    </>
  );
};

export default ObservationDataTable;
