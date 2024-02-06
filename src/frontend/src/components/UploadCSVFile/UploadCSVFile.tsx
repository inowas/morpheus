import React, {ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useRef, useState} from 'react';
import {Checkbox, Dimmer, DropdownProps, Form, Icon, List, Loader, Pagination, PaginationProps, Table} from 'semantic-ui-react';
import {Button, Modal} from 'components';
import {DataGrid, DataRow} from 'components/Models';
import styles from './UploadCSVFile.module.less';
import * as Papa from 'papaparse';
import {ParseResult} from 'papaparse';
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import moment, {Moment} from 'moment';

export type TColumns = Array<{ key: number; value: string; text: string; type?: ECsvColumnType }>;

export enum ECsvColumnType {
  BOOLEAN = 'boolean',
  DATE_TIME = 'date_time',
  NUMBER = 'number',
}

interface IProps {
  onSave: (ds: any[][]) => void;
  onCancel: () => void;
  columns: TColumns;
  // TODO do we need to use useDateTimes and fixedDateTimes?
  fixedDateTimes?: Moment[];
  useDateTimes?: boolean;
}

// TODO! fix this
// interface IState {
//   columns: TColumns;
//   metadata: ParseResult<any> | null;
//   method: string;
//   dateTimeFormat: string;
//   firstRowIsHeader: boolean;
//   parameterColumns: { [name: string]: number } | null;
//   fileToParse: File | null;
//   parsingData: boolean;
//   processedData: any[][] | null;
//   isFetching: boolean;
//   paginationPage: number;
//   openUploadPopup: boolean;
// }
//
// function reducer(state: any, action: any) {
//   console.log(state, action);
// }
// TODO! fix this

const UploadCSVFile: React.FC<IProps> = (props) => {

  // TODO! fix this
  // const initialState: IState = {
  //   columns: props.columns,
  //   metadata: null,
  //   method: props.useDateTimes ? 'datetime' : 'key',
  //   dateTimeFormat: 'YYYY.MM.DD',
  //   firstRowIsHeader: true,
  //   parameterColumns: null,
  //   fileToParse: null,
  //   parsingData: false,
  //   processedData: null,
  //   isFetching: false,
  //   paginationPage: 1,
  //   openUploadPopup: false,
  // };
  // @ts-ignore
  // const [state, dispatch] = useReducer(reducer, initialState);
  // TODO! fix this

  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;


  const [columns, setColumns] = useState<TColumns>(props.columns);
  const [metadata, setMetadata] = useState<ParseResult<any> | null>(null);
  const [method, setMethod] = useState<string>(props.useDateTimes ? 'datetime' : 'key');
  const [dateTimeFormat, setDateTimeFormat] = useState<string>('YYYY.MM.DD');
  const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);
  const [parameterColumns, setParameterColumns] = useState<{ [name: string]: number } | null>(null);
  const [fileToParse, setFileToParse] = useState<File | null>(null);
  const [parsingData, setParsingData] = useState<boolean>(false);
  const [processedData, setProcessedData] = useState<any[][] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [openUploadPopup, setOpenUploadPopup] = useState(false);
  const rowsPerPage = 50;

  const useDateTimes = 'datetime' === method ||
    0 < columns.filter((c) => c.type === ECsvColumnType.DATE_TIME).length || props.useDateTimes;

  const processData = ({data}: ParseResult<any>) => {
    if (
      (!metadata) ||
      (!parameterColumns) ||
      (parameterColumns && Object.keys(parameterColumns).length !== columns.length)
    ) {
      return;
    }
    const nData: any[][] = [];

    if (props.fixedDateTimes && useDateTimes) {
      let previousRow: any[] = columns.map(() => 0);
      props.fixedDateTimes.forEach((dt) => {
        let row: any[] = _.cloneDeep(previousRow);
        row[0] = dt;
        const filteredImportedRow = data.filter((r) => moment.utc(r[0], dateTimeFormat).isSame(dt));
        if (1 <= filteredImportedRow.length) {
          const r = filteredImportedRow[0];
          row = columns.map((c) => {
            if (c.type === ECsvColumnType.DATE_TIME) {
              return dt;
            }
            if (c.type === ECsvColumnType.BOOLEAN) {
              return 1 === r[parameterColumns[c.value]] || true === r[parameterColumns[c.value]] ||
                'true' === r[parameterColumns[c.value]];
            }
            return r[parameterColumns[c.value]] || 0;
          });
        }

        previousRow = row;
        nData.push(row);
      });
    } else {
      data.forEach((r, rKey) => {
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
    }

    setIsFetching(false);
    setProcessedData(nData);
  };

  useEffect(() => {
    if (props.useDateTimes || 'datetime' === method) {
      setColumns(([{
        key: 0,
        value: 'datetime',
        text: 'Datetime',
        type: ECsvColumnType.DATE_TIME,
      }] as TColumns).concat(props.columns));
    } else {
      setColumns(props.columns);
    }
  }, [props.columns, props.useDateTimes, method]);

  useEffect(() => {
    if (metadata && parameterColumns && Object.keys(parameterColumns).length === columns.length) {
      setIsFetching(true);
    }
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
    if (metadata && isFetching) {
      processData(metadata);
    }
  }, [metadata, isFetching]);

  useEffect(() => {
    console.log(openUploadPopup);
  }, [openUploadPopup]);

  const handleBlurDateTimeFormat = () => {
    if (metadata && parameterColumns && Object.keys(parameterColumns).length === columns.length) {
      setIsFetching(true);
    }
  };

  const clearFileInput = () => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  const handleSave = () => {
    if (processedData) {
      let result = processedData;
      if (useDateTimes && props.fixedDateTimes) {
        result = processedData.map((row) => {
          row.shift();
          return row;
        });
      }

      props.onCancel();
      props.onSave(result);
      setOpenUploadPopup(false);
    }
  };
  const handleCansel = () => {
    props.onCancel();
    clearFileInput();
    setOpenUploadPopup(false);
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

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && 0 < files.length ? files[0] : null;
    if (file) {
      setFileToParse(file);
      setParsingData(true);
    }
    setOpenUploadPopup(!openUploadPopup);

    // TODO! fix this
    // const action = {
    //   ...state,
    //   openUploadPopup: !state.openUploadPopup,
    // };
    // // @ts-ignore
    // dispatch(action);
    // TODO! fix this
  };

  const handleChangePagination = (e: MouseEvent, {activePage}: PaginationProps) =>
    setPaginationPage('number' === typeof activePage ? activePage : 1);

  const renderProcessedData = () => {
    if (!processedData) {
      return null;
    }

    const startingIndex = (paginationPage - 1) * rowsPerPage;
    const endingIndex = startingIndex + rowsPerPage;

    return processedData.slice(startingIndex, endingIndex).map((row, rKey) => (
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
    for (let i = 0; 150 > i; i++) {
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

  const renderContent = () => (
    <>
      {(parsingData || isFetching) &&
        <Dimmer active={true} inverted={true}>
          <Loader inverted={true}>Loading</Loader>
        </Dimmer>
      }
      {!isFetching &&
        <DataGrid>
          <DataRow title={'UPLOAD DATASET'}/>
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
                <DataGrid multiColumns={2}>
                  <Form.Field className={styles.dateFormat}>
                    <label className={`${styles.dateFormatLabel} labelSmall`} style={{textAlign: 'left', fontWeight: 600}}>
                      <Icon className={'dateIcon'} name="info circle"/>
                      Date format
                    </label>
                    <Form.Input
                      className={styles.dateFormatInput}
                      disabled={!useDateTimes}
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
              <DataGrid multiColumns={4}>
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
                      <Table.Row>
                        {columns.map((c, cKey) =>
                          <Table.HeaderCell key={cKey}>{c.text}</Table.HeaderCell>,
                        )}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {processedData && renderProcessedData()}
                      {!processedData && renderEmptyTable()}
                    </Table.Body>
                  </Table>
                </div>
              </DataRow>
              {processedData && processedData.length > rowsPerPage &&
                <Pagination
                  activePage={paginationPage}
                  onPageChange={handleChangePagination}
                  size="mini"
                  totalPages={Math.ceil(processedData.length / rowsPerPage)}
                  pointing={true}
                  secondary={true}
                  firstItem={null}
                  lastItem={null}
                />
              }
            </>
          }
        </DataGrid>
      }
    </>
  );

  // TODO handleChangeMethod for useDateTimes
  // const handleChangeMethod = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
  //   if ('string' !== typeof value || props.useDateTimes) {
  //     return null;
  //   }
  //   setMethod(value);
  // };

  return (
    <>
      <label className={styles.fileInput}>File:
        <input
          ref={ref}
          onChange={handleUploadFile}
          name="file"
          type="file"
        />
      </label>
      <Modal.Modal
        onClose={() => setOpenUploadPopup(false)}
        onOpen={() => setOpenUploadPopup(true)}
        open={openUploadPopup}
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
        </Modal.Content>
      </Modal.Modal>
    </>
  );
};

export default UploadCSVFile;
