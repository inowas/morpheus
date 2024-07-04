import React, {useEffect, useState} from 'react';
import {IBoundaryObservationData, IBoundaryType, IInterpolationType, IObservation} from '../../../../types/Boundaries.type';
import {useDateTimeFormat} from 'common/hooks';
import {Checkbox, Icon, Popup, SemanticWIDTHS, Table, TableBody, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import BoundariesUpload from '../BoundariesUpload/BoundariesUpload';
import {ITimeDiscretization} from '../../../../types';
import {Button} from 'common/components';
import DataTableInput from './DataTableInput';
import cloneDeep from 'lodash.clonedeep';
import {getBoundaryColumnsByType, getNewBoundaryDataItemByType} from './helpers';
import styles from './ObservationDataTable.module.less';

interface IProps {
  boundaryType: IBoundaryType;
  observation: IObservation<any>;
  onChangeObservation: (observation: IObservation<any>) => void;
  interpolation: IInterpolationType;
  timeDiscretization: ITimeDiscretization;
  isReadOnly: boolean;
}

type IBoundaryObservationDataEnabled = IBoundaryObservationData & { enabled: boolean, [key: string]: any };

const ObservationDataTableWithDisabledInterpolation = ({boundaryType, observation, onChangeObservation, timeDiscretization, isReadOnly}: IProps) => {

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

  const mapData = (dataToMap: IBoundaryObservationDataEnabled[]): IBoundaryObservationData[] => {
    return dataToMap.filter((item) => item.enabled)
      .map((item) => {
        const {enabled, ...rest} = item;
        return rest;
      });
  };

  const handleSubmit = () => onChangeObservation({...observation, data: mapData(data)});

  const columns = getBoundaryColumnsByType(boundaryType, formatISODate, parseDate);
  const columnWidth = Math.floor(14 / columns.length);

  return (
    <>
      <BoundariesUpload
        onSubmit={() => console.log('Submit from ObservationDataTable')}
        columns={columns}
      />
      <div className='scrollableTable'>
        <Table
          className={styles.table}
          celled={true}
          striped={true}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell width={1} style={{textAlign: 'center'}}>No</TableHeaderCell>
              {columns.map((column, idx) => (
                <TableHeaderCell
                  singleLine={true}
                  className='field'
                  width={columnWidth as SemanticWIDTHS}
                  key={idx}
                >
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
              <TableHeaderCell width={1} style={{textAlign: 'center'}}/>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowId) => (
              <TableRow
                key={rowId}
                disabled={!row.enabled}
              >
                <Table.Cell width={1} style={{textAlign: 'center'}}>{rowId + 1}</Table.Cell>
                {columns.map((column, idx) => (
                  <Table.Cell
                    width={columnWidth as SemanticWIDTHS}
                    key={idx}
                    disabled={!row.enabled}
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
                <Table.Cell width={1} style={{textAlign: 'center'}}>
                  <Checkbox
                    disabled={0 === rowId || isReadOnly}
                    toggle={true}
                    checked={0 === rowId || row.enabled}
                    style={{pointerEvents: 'all'}}
                    onChange={(e, {checked}) => {
                      const newData = [...data];
                      newData[rowId].enabled = checked || false;
                      setData(newData);
                    }}
                  />
                </Table.Cell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!isReadOnly && <Button
        style={{marginTop: 20}}
        onClick={handleSubmit}
        disabled={JSON.stringify(observation.data) === JSON.stringify(mapData(data))}
        content={'Submit'}
      />}
    </>
  );
};

export default ObservationDataTableWithDisabledInterpolation;
