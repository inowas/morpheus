import React, {useEffect, useState} from 'react';
import styles from './StressperiodsUpload.module.less';
import {ECsvColumnType, IColumn} from './types/StressperiodsUpload.type';
import {Button, Modal, Notification, SectionTitle} from 'common/components';
import {Checkbox, Form, Icon, Table} from 'semantic-ui-react';
import {DataGrid, DataRow} from 'common/components/DataGrid';
import {IStressPeriod} from '../../../../types';
import {useDateTimeFormat} from 'common/hooks';


interface IProps {
  columns: IColumn[];
  rawData: any[][];
  onSubmit: (stressPeriods: IStressPeriod[]) => void
  onCancel: () => void;
  timeZone?: string;
}

interface IIndexedColumn extends IColumn {
  colIdx: number;
}

const StressperiodsUploadModal = ({columns, rawData, onSubmit, onCancel, timeZone}: IProps) => {
  const [columnOrder, setColumnOrder] = useState<IIndexedColumn[]>(columns.map((c, idx) => ({...c, colIdx: idx})));
  const [dateTimeFormat, setDateTimeFormat] = useState<string>('dd.MM.yyyy');
  const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);
  const [stressPeriods, setStressPeriods] = useState<IStressPeriod[] | null>(null);

  const {format, isValid, parseUserInput} = useDateTimeFormat(timeZone);

  useEffect(() => {
    const parsedData: IStressPeriod[] = [];
    rawData.forEach((rawDataRow, rowIdx) => {
      if (firstRowIsHeader && 0 === rowIdx) {
        return;
      }

      const parsedDataRow: { [key: string]: any } = {};

      columnOrder.forEach((column) => {
        const colIdx = column.colIdx;
        if (colIdx >= rawDataRow.length) {
          parsedDataRow[column.value] = column.default;
        }

        if (column.type === ECsvColumnType.DATE_TIME) {
          const value = rawDataRow[colIdx];
          const parsedDate = parseUserInput(value, dateTimeFormat);
          if (isValid(parsedDate)) {
            parsedDataRow[column.value] = format(parsedDate, dateTimeFormat);
          } else {
            parsedDataRow[column.value] = column.default;
          }
        }

        if (column.type === ECsvColumnType.BOOLEAN) {
          const value = rawDataRow[colIdx];
          parsedDataRow[column.value] = 'true' === value.toLowerCase() || '1' === value;
        }

        if (column.type === ECsvColumnType.FLOAT) {
          const value = rawDataRow[colIdx];
          parsedDataRow[column.value] = parseFloat(value);
        }

        if (column.type === ECsvColumnType.INTEGER) {
          const value = rawDataRow[colIdx];
          parsedDataRow[column.value] = parseInt(value);
        }
      });

      parsedData.push({
        start_date_time: parsedDataRow.start_date_time || 'Invalid Date',
        number_of_time_steps: parsedDataRow.number_of_time_steps || '-',
        time_step_multiplier: parsedDataRow.time_step_multiplier || '-',
        steady_state: parsedDataRow.steady_state || '-',
      });
    });

    setStressPeriods(parsedData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, firstRowIsHeader, dateTimeFormat, columns, columnOrder]);

  const isFormValid = () => {
    try {

      let formIsValid = true;

      if (!stressPeriods) {
        formIsValid = false;
        return formIsValid;
      }

      stressPeriods.forEach((sp) => {
        if (!isValid(parseUserInput(sp.start_date_time, dateTimeFormat))) {
          formIsValid = false;
        }
      });

      return formIsValid;
    } catch (e) {
      return false;
    }
  };

  const handleSave = () => {
    if (!isFormValid()) {
      return;
    }

    if (stressPeriods) {
      const stressPeriodsWithIsoDates = stressPeriods.map((sp) => ({
        ...sp,
        start_date_time: parseUserInput(sp.start_date_time, dateTimeFormat),
      }));

      stressPeriodsWithIsoDates.sort((a, b) => {
        return a.start_date_time.localeCompare(b.start_date_time);
      });

      onSubmit(stressPeriodsWithIsoDates);
      onCancel();
    }
  };

  const handleCancel = () => onCancel();

  const handleChange = (f: (v: any) => void) => (e: any, d: any) => {
    if ('value' in d) {
      f(d.value.toLowerCase());
    }

    if ('checked' in d) {
      f(d.checked);
    }
  };

  const renderHeader = () => (
    <Table.Row>
      {columns.map((c, cKey) =>
        <Table.HeaderCell key={cKey}>{c.text}</Table.HeaderCell>,
      )}
    </Table.Row>
  );

  const renderEmptyTable = () => {
    const emptyTable = [];
    for (let i = 0; 10 > i; i++) {
      emptyTable.push(
        <Table.Row key={i}>
          {columns.map((c, cKey) => (
            <Table.Cell key={cKey}>{' '}</Table.Cell>
          ))}
        </Table.Row>,
      );
    }
    return emptyTable;
  };

  const renderStressPeriods = () => {
    if (!stressPeriods) {
      return null;
    }

    if (0 === stressPeriods.length) {
      return renderEmptyTable();
    }

    return stressPeriods.map((row, rKey) => (
      <Table.Row key={rKey}>
        <Table.Cell style={{padding: '5px 20px'}}>{row.start_date_time}</Table.Cell>
        <Table.Cell style={{padding: '5px 20px'}}>{row.number_of_time_steps}</Table.Cell>
        <Table.Cell style={{padding: '5px 20px'}}>{row.time_step_multiplier}</Table.Cell>
        <Table.Cell style={{padding: '5px 20px'}}>{row.steady_state ? 'true' : 'false'}</Table.Cell>
      </Table.Row>
    ));
  };

  const renderContent = () => {
    return (
      <>
        <DataGrid>
          <SectionTitle title={'UPLOAD DATASET'}/>
          {stressPeriods && 0 < stressPeriods.length &&
            <>
              <DataRow>
                <DataGrid columns={2}>
                  <Form.Field className={styles.dateFormat}>
                    <label className={`${styles.dateFormatLabel} labelSmall`} style={{textAlign: 'left', fontWeight: 600}}>
                      <Icon className={'dateIcon'} name="info circle"/>
                      Date format
                    </label>
                    <Form.Dropdown
                      style={{backgroundColor: 'white', padding: '5px 10px'}}
                      value={dateTimeFormat}
                      options={[
                        {key: 0, value: 'yyyy-MM-dd', text: format(new Date().toISOString(), 'yyyy-MM-dd')},
                        {key: 1, value: 'yyyy/MM/dd', text: format(new Date().toISOString(), 'yyyy/MM/dd')},
                        {key: 2, value: 'yyyyMMdd', text: format(new Date().toISOString(), 'yyyyMMdd')},
                        {key: 3, value: 'dd.MM.yyyy', text: format(new Date().toISOString(), 'dd.MM.yyyy')},
                      ]}
                      onChange={(e, d) => setDateTimeFormat(d.value as string)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      style={{textAlign: 'left', fontWeight: 600}}
                      label="First row is header"
                      checked={firstRowIsHeader}
                      onChange={handleChange(setFirstRowIsHeader)}
                      data-value={firstRowIsHeader ? 'true' : 'false'}
                    />
                  </Form.Field>
                </DataGrid>
              </DataRow>
              <DataGrid columns={4}>
                {columns.map((c, key) => (
                  <Form.Field key={key}>
                    <label className="labelSmall" style={{textAlign: 'left', fontWeight: 600}}>
                      <Icon className={'dateIcon'} name="info circle"/>
                      {c.text}
                    </label>
                    <Form.Dropdown
                      key={key}
                      name={c.value}
                      selection={true}
                      value={columnOrder[key].colIdx}
                      onChange={(e, d) => {
                        const newColumnOrder = columnOrder.map((co, idx) => {
                          if (idx === key) {
                            return {...co, colIdx: d.value as number};
                          }

                          return co;
                        });
                        setColumnOrder(newColumnOrder);
                      }}
                      options={rawData[0].map((value: string, idx) => ({
                        key: idx,
                        value: idx,
                        text: firstRowIsHeader ? value : `Column ${idx + 1}`,
                      }))}
                    />
                  </Form.Field>
                ))}
              </DataGrid>
              <DataRow>
                {stressPeriods && 0 === stressPeriods.length && <Notification warning={true}>
                  The CSV file cannot be empty
                </Notification>}
                <div className={styles.scrollContainer}>
                  <Table
                    celled={true} structured={true}
                    className={styles.table}
                  >
                    <Table.Header>
                      {renderHeader()}
                    </Table.Header>
                    <Table.Body>
                      {stressPeriods && renderStressPeriods()}
                    </Table.Body>
                  </Table>
                </div>
              </DataRow>
            </>
          }
        </DataGrid>
      </>);
  };

  return (
    <Modal.Modal
      open={true}
      onClose={handleCancel}
      dimmer={'inverted'}
    >
      <Modal.Content>
        <DataGrid>
          {renderContent()}
          <div className={styles.buttonGroup}>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
              }}
              onClick={handleCancel}
            >Cancel</Button>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
              }}
              primary={!!stressPeriods}
              disabled={!isFormValid()}
              onClick={handleSave}
            >
              Apply
            </Button>
          </div>
        </DataGrid>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default StressperiodsUploadModal;
