import React, {SyntheticEvent, useEffect, useState} from 'react';
import styles from './StressperiodsUpload.module.less';
import {ECsvColumnType, TColumns} from './types/StressperiodsUpload.type';
import {Button, SectionTitle} from 'common/components';
import {Checkbox, Dimmer, DropdownProps, Form, Icon, List, Loader, Table} from 'semantic-ui-react';
import {DataGrid, DataRow} from 'common/components/DataGrid';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import * as Papa from 'papaparse';
import {ParseResult} from 'papaparse';

interface IProps {
  data: File;
  onSave: (data: any) => void
  onCancel: () => void;
  columns: TColumns;
}


const StressperiodsUploadModal = ({data, onSave, onCancel, columns: propsColumns}: IProps) => {
  const [columns, setColumns] = useState<TColumns>(propsColumns);
  const [metadata, setMetadata] = useState<ParseResult<any> | null>(null);
  const [dateTimeFormat, setDateTimeFormat] = useState<string>('YYYY.MM.DD');
  const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);
  const [parameterColumns, setParameterColumns] = useState<{ [name: string]: number } | null>(null);
  const [parsingData, setParsingData] = useState<boolean>(false);
  const [fileToParse, setFileToParse] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<any[][] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  // const [openUploadPopup, setOpenUploadPopup] = useState(false);
  // const [reservedData, setReservedData] = useState<string | null>(null);
  // const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  // const [resetDataFoo, setResetDataFoo] = useState<any>(() => {
  // });

  useEffect(() => {
    setFileToParse(data);
    setParsingData(true);
  }, [data]);

  const resetFileState = () => {
    setColumns(propsColumns);
    setMetadata(null);
    setDateTimeFormat('YYYY.MM.DD');
    setFirstRowIsHeader(true);
    setParameterColumns(null);
    setParsingData(false);
    setFileToParse(null);
    setProcessedData(null);
    setIsFetching(false);
  };

  const processData = ({data: parseResult}: ParseResult<any>) => {
    if (
      (!metadata) ||
      (!parameterColumns) ||
      (parameterColumns && Object.keys(parameterColumns).length !== columns.length)
    ) {
      return;
    }
    const nData: any[][] = [];
    parseResult.forEach((r, rKey) => {
      if (!firstRowIsHeader || (firstRowIsHeader && 0 < rKey)) {
        const row = columns.map((c) => {
          if (c.type === ECsvColumnType.DATE_TIME) {
            return moment.utc(r[parameterColumns[c.value]], dateTimeFormat);
          }
          if (c.type === ECsvColumnType.BOOLEAN) {
            return 1 === r[parameterColumns[c.value]] || true === r[parameterColumns[c.value]] ||
              'true' === r[parameterColumns[c.value]];
          }
          return r[parameterColumns[c.value]] || 0;
        });
        nData.push(row);
      }
    });
    setIsFetching(false);
    setProcessedData(nData);
  };

  // Set default parameter in dropdowns
  useEffect(() => {
    if (fileToParse) {
      const defaultParamColumns: { [name: string]: number } = {};
      columns.forEach((c, idx) => {
        defaultParamColumns[c.value] = idx;
      });
      setParameterColumns(defaultParamColumns);
      setIsFetching(true);
    }
  }, [fileToParse, columns]);

  useEffect(() => {
    setColumns(columns);
  }, [columns]);

  useEffect(() => {
    if (metadata && parameterColumns && Object.keys(parameterColumns).length === columns.length) {
      setIsFetching(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstRowIsHeader, parameterColumns]);

  useEffect(() => {
    if (parsingData && fileToParse) {
      Papa.parse(fileToParse, {
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          setMetadata(results);
          setParsingData(false);
        },
      });
    }
  }, [parsingData, fileToParse]);

  useEffect(() => {
    if (metadata) {
      processData(metadata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, isFetching]);


  const handleBlurDateTimeFormat = () => {
    if (metadata && parameterColumns && Object.keys(parameterColumns).length === columns.length) {
      setIsFetching(true);
    }
  };

  const transformData = (inputData: any[][] | []): any[] | [] => {
    if (!inputData) {
      return [];
    }
    const transformedData = inputData.map((row) => {
      const [startDateTime, nstp, tsmult, steady] = row;

      return {
        key: uuidv4(),
        start_date_time: startDateTime,
        nstp,
        tsmult,
        steady,
      };
    });
    return transformedData;
  };
  const handleSave = () => {
    if (processedData) {
      let result = transformData(processedData);
      onSave(result);
      onCancel();
      console.log(JSON.stringify(transformData(processedData), null, 2));
    }
  };

  const handleCansel = () => {
    resetFileState();
    console.log('onCancel');
    onCancel();
    // setFileName(reservedData);
  };

  const handleChange = (f: (v: any) => void) => (e: any, d: any) => {
    if ('value' in d) {
      f(d.value);
    }

    if ('checked' in d) {
      f(d.checked);
    }
  };

  const handleChangeParameterColumn = (e: SyntheticEvent, {name, value}: DropdownProps) => {
    setParameterColumns({
      ...parameterColumns,
      [name]: value,
    });
  };

  const parseToString = (value: any) => {
    if ('boolean' === typeof value) {
      return value.toString();
    }
    if ('number' === typeof value) {
      return value.toFixed(3);
    }
    if (moment.isMoment(value)) {
      return value.format(dateTimeFormat);
    }
    return value;
  };


  const renderHeader = () => (
    <Table.Row>
      {columns.map((c, cKey) =>
        <Table.HeaderCell key={cKey}>{c.text}</Table.HeaderCell>,
      )}
    </Table.Row>
  );

  const renderProcessedData = () => {
    if (!processedData) {
      return null;
    }
    return processedData.map((row, rKey) => (
      <Table.Row key={rKey}>
        {row.map((c, cKey) => (
          <Table.Cell key={cKey} style={{padding: '5px 20px'}}>
            {parseToString(c)}
          </Table.Cell>
        ))}
      </Table.Row>
    ));
  };

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

  const renderContent = () => {
    return (<>
      {(parsingData || isFetching) &&
        <Dimmer active={true} inverted={true}>
          <Loader inverted={true}>Loading</Loader>
        </Dimmer>
      }
      {!isFetching &&
        <DataGrid>
          <SectionTitle title={'UPLOAD DATASET'}/>
          {metadata && 0 < metadata.errors.length &&
            <List divided={true} relaxed={true}>
              {metadata.errors.map((e, key) => (
                <List.Item key={key}>
                  <List.Content style={{padding: '6px'}}>
                    <List.Header>{e.type}: {e.code}</List.Header>
                    <List.Description as="a">{e.message} in
                      row {e.row}</List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          }
          {metadata && 0 === metadata.errors.length &&
            <>
              <DataRow>
                <DataGrid columns={2}>
                  <Form.Field className={styles.dateFormat}>
                    <label className={`${styles.dateFormatLabel} labelSmall`} style={{textAlign: 'left', fontWeight: 600}}>
                      <Icon className={'dateIcon'} name="info circle"/>
                      Date format
                    </label>
                    <Form.Input
                      className={styles.dateFormatInput}
                      onBlur={handleBlurDateTimeFormat}
                      onChange={handleChange(setDateTimeFormat)}
                      name={'datetimeField'}
                      value={dateTimeFormat}
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
                      value={parameterColumns ? parameterColumns[c.value] : undefined}
                      onChange={handleChangeParameterColumn}
                      options={metadata.data[0].map((s: string, idx: number) => ({
                        key: idx,
                        value: idx,
                        text: firstRowIsHeader ? s : `Column ${idx + 1}`,
                      }))}
                    />
                  </Form.Field>
                ))}
              </DataGrid>
              <DataRow>
                <div className={styles.scrollContainer}>
                  <Table
                    celled={true} structured={true}
                    className={styles.table}
                  >
                    <Table.Header>
                      {renderHeader()}
                    </Table.Header>
                    <Table.Body>

                      {processedData && renderProcessedData()}
                      {processedData && 0 === processedData.length && renderEmptyTable()}
                    </Table.Body>
                  </Table>
                </div>
              </DataRow>
            </>
          }
        </DataGrid>
      }
    </>);
  };

  return (
    <DataGrid>
      {renderContent()}
      <div className={styles.buttonGroup}>
        <Button
          style={{
            fontSize: '17px',
            textTransform: 'capitalize',
          }}
          onClick={handleCansel}
        >Cancel</Button>
        <Button
          style={{
            fontSize: '17px',
            textTransform: 'capitalize',
          }}
          primary={!!processedData}
          disabled={!processedData}
          onClick={handleSave}
        >
          Apply
        </Button>
      </div>
    </DataGrid>
  );
};


export default StressperiodsUploadModal;
