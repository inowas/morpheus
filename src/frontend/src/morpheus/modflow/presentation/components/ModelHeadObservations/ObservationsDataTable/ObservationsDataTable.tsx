import React, {useEffect, useState} from 'react';
import DataTable, {IColumn} from './DataTable';
import {useDateTimeFormat} from 'common/hooks';
import {Button} from 'common/components';
import styles from './ObservationsDataTable.module.less';
import {Icon} from 'semantic-ui-react';
import {ITimeDiscretization} from '../../../../types';
import {IHeadObservation, IObservationData, IObservationType} from '../../../../types/HeadObservations.type';

interface IProps {
  observation: IHeadObservation;
  onChangeObservation: (observation: IHeadObservation) => void;
  timeDiscretization: ITimeDiscretization;
  isReadOnly: boolean;
}

type IFormatDate = (dateString: string, formatString: string) => string;

const isNotNullish = (value: any): value is number => null !== value && value !== undefined;
const formatNumberOrNull = (fractionDigits: number) => (value: number | null) => isNotNullish(value) ? value.toFixed(fractionDigits) : '-';
const parseNumber = (value: string) => parseFloat(value) as number;

const getColumns = (boundaryType: IObservationType, formatDate: IFormatDate, parseDate: IFormatDate): IColumn[] => {
  const defaultColumns: IColumn[] = [{
    title: 'Start date',
    key: 'date_time',
    format: (value: string) => formatDate(value, 'yyyy-MM-dd'),
    parse: (value: string) => parseDate(value, 'yyyy-MM-dd'),
    defaultValue: 0,
    inputType: 'date',
  }];
  switch (boundaryType) {
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

const newRow = (type: IObservationType, dateString: string): IObservationData => {
  switch (type) {
  case 'head':
    return {date_time: dateString, head: 0};
  }
};

const ObservationsDataTable = ({observation, onChangeObservation}: IProps) => {

  const {formatDate, parseUserInput, addDays, addWeeks, addMonths, addYears} = useDateTimeFormat('UTC');
  const [data, setData] = useState<IObservationData[]>(observation.data || []);

  useEffect(() => {
    setData(observation.data || []);
  }, [observation.data]);

  const addUniqueDataPoint = (dataPoint: IObservationData) => {
    // add new data to the existing data but only if the date_time is unique
    if (data.find((d) => d.date_time === dataPoint.date_time)) {
      return;
    }

    const newData = [...data, dataPoint];
    newData.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());
    setData(newData);
  };

  const updateDataPoint = (dataPoint: IObservationData) => {
    const newData = data.map((d) => d.date_time === dataPoint.date_time ? dataPoint : d);
    setData(newData);
  };

  const removeDataPoint = (dataPoint: IObservationData) => {
    const newData = data.filter((d) => d.date_time !== dataPoint.date_time);
    setData(newData);
  };

  const handleChangedData = (newData: { [key: string]: any; }[]) => {
    setData(newData as IObservationData[]);
  };

  const latestDate = data[data.length - 1].date_time;

  return (
    <>
      <DataTable
        columns={getColumns(observation.type, formatDate, parseUserInput)}
        data={data}
        onChangeData={handleChangedData}
      />
      <div className={styles.buttonsGroup}>
        <Button className='buttonLink' onClick={() => addUniqueDataPoint(newRow(observation.type, addDays(latestDate, 1)))}>
          <Icon name="add"/> 1 day
        </Button>
        <Button className='buttonLink' onClick={() => addUniqueDataPoint(newRow(observation.type, addWeeks(latestDate, 1)))}>
          <Icon name="add"/> 1 week
        </Button>
        <Button className='buttonLink' onClick={() => addUniqueDataPoint(newRow(observation.type, addMonths(latestDate, 1)))}>
          <Icon name="add"/> 1 month
        </Button>
        <Button className='buttonLink' onClick={() => addUniqueDataPoint(newRow(observation.type, addYears(latestDate, 1)))}>
          <Icon name="add"/> 1 year
        </Button>
        <Button disabled={data === observation.data} onClick={() => onChangeObservation({...observation, data})}>Save</Button>
      </div>
    </>
  );
};

export default ObservationsDataTable;
