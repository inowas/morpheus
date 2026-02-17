import React, {useEffect, useState} from 'react';
import {IBoundaryObservationValue, IBoundaryType, IObservation} from '../../../../types/Boundaries.type';
import {useDateTimeFormat} from 'common/hooks';
import {Checkbox, Icon, Popup, Table, TableBody, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import BoundariesUpload from '../BoundaryUpload/BoundariesUpload';
import {ITimeDiscretization} from '../../../../types';
import {Button} from 'common/components';
import DataTableInput from './DataTableInput';
import cloneDeep from 'lodash.clonedeep';
import {getBoundaryColumnsByType, getNewBoundaryDataItemByType} from './helpers';

interface IProps {
  boundaryType: IBoundaryType;
  observation: IObservation<any>;
  onChangeObservation: (observation: IObservation<any>) => void;
  timeDiscretization: ITimeDiscretization;
  isReadOnly: boolean;
}

type IBoundaryObservationDataEnabled = IBoundaryObservationValue & { enabled: boolean, [key: string]: any };

const BoundaryDataTableStressPeriods = ({boundaryType, observation, onChangeObservation, timeDiscretization, isReadOnly}: IProps) => {

  const {formatISODate, parseDate} = useDateTimeFormat('UTC');
  const [data, setData] = useState<IBoundaryObservationDataEnabled[]>(observation.data || []);

  useEffect(() => {
    const observationData = timeDiscretization.stress_periods.map((sp, spIdx) => {
      const dataSet = observation.data.find((d) => d.date_time === sp.start_date_time);
      if (dataSet) {
        return {enabled: true, ...dataSet};
      }

      if (!dataSet && 0 === spIdx) {
        return {enabled: true, ...getNewBoundaryDataItemByType(boundaryType, sp.start_date_time)};
      }

      return {enabled: false, ...getNewBoundaryDataItemByType(boundaryType, sp.start_date_time)};
    });

    setData(observationData);
  }, [boundaryType, observation.data, timeDiscretization]);

  const mapData = (dataToMap: IBoundaryObservationDataEnabled[]): IBoundaryObservationValue[] => {
    return dataToMap.filter((item) => item.enabled)
      .map((item) => {
        const {enabled, ...rest} = item;
        return rest;
      });
  };

  const handleSubmit = () => onChangeObservation({...observation, data: mapData(data)});

  const columns = getBoundaryColumnsByType(boundaryType, formatISODate, parseDate);

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
                    disabled={0 === rowId || isReadOnly}
                    toggle={true}
                    checked={0 === rowId || row.enabled}
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
        content={'Save'}
        style={{marginLeft: 'auto'}}
        primary={true}
        labelPosition={'left'}
        size={'tiny'}
        icon={'save'}
      />}
    </>
  );
};

export default BoundaryDataTableStressPeriods;
