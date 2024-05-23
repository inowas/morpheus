import * as Papa from 'papaparse';
import {ParseResult} from 'papaparse';

import {Button, Modal, SectionTitle} from 'common/components';
import {Checkbox, Dimmer, DropdownProps, Form, Icon, List, Loader, Pagination, PaginationProps, Table} from 'semantic-ui-react';
import {DataGrid, DataRow} from 'common/components/DataGrid';
import {ECsvColumnType, IProps, TColumns} from './types/UploadCSVFile.type';
import React, {ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useRef, useState} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import styles from './UploadCSVFile.module.less';
import {v4 as uuidv4} from 'uuid';

const UploadCSVFile: React.FC<IProps> = (props) => {

  const ref = useRef<HTMLInputElement>(null);

  const [columns, setColumns] = useState<TColumns>(props.columns);
  const [metadata, setMetadata] = useState<ParseResult<any> | null>(null);
  const [dateTimeFormat, setDateTimeFormat] = useState<string>('YYYY.MM.DD');
  const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);
  const [parameterColumns, setParameterColumns] = useState<{ [name: string]: number } | null>(null);
  const [fileToParse, setFileToParse] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsingData, setParsingData] = useState<boolean>(false);
  const [processedData, setProcessedData] = useState<any[][] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [openUploadPopup, setOpenUploadPopup] = useState(false);
  const [reservedData, setReservedData] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [resetDataFoo, setResetDataFoo] = useState<any>(() => {
  });

  const rowsPerPage = 50;
  const resetFileState = () => {
    setColumns(props.columns);
    setMetadata(null);
    setDateTimeFormat('YYYY.MM.DD');
    setFirstRowIsHeader(true);
    setParameterColumns(null);
    setFileToParse(null);
    setParsingData(false);
    setProcessedData(null);
    setIsFetching(false);
    setPaginationPage(1);
    setOpenUploadPopup(false);
  };

  const processData = ({data}: ParseResult<any>) => {
    if (
      (!metadata) ||
      (!parameterColumns) ||
      (parameterColumns && Object.keys(parameterColumns).length !== columns.length)
    ) {
      return;
    }
    const nData: any[][] = [];
    data.forEach((r, rKey) => {
      if (!firstRowIsHeader || (firstRowIsHeader && 0 < rKey)) {
        const row = columns.map((c) => {
          if (c.type === ECsvColumnType.DATE_TIME) {
            console.log(moment.utc(r[parameterColumns[c.value]], dateTimeFormat));
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
    setColumns(props.columns);
  }, [props.columns]);

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
    if (metadata && isFetching) {
      processData(metadata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, isFetching]);

  const handleDownloadTemplate = () => {
    const filename = 'stressperiods_template.csv';
    const todayDate = moment().format('YYYY-MM-DD');
    const templateText = `start_date_time;nstp;tsmult;steady\n${todayDate};1;1;1\n`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(templateText));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleBlurDateTimeFormat = () => {
    if (metadata && parameterColumns && Object.keys(parameterColumns).length === columns.length) {
      setIsFetching(true);
    }
  };

  const transformData = (data: any[][] | []): any[] | [] => {
    if (!data) {
      return [];
    }
    const transformedData = data.map((row) => {
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
      props.onSave(result);
      props.onCancel();
      setOpenUploadPopup(false);
      // console.log(JSON.stringify(transformData(processedData), null, 2));
    }
  };

  const handleCansel = () => {
    props.onCancel();
    setOpenUploadPopup(false);
    setFileName(reservedData);
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
    const files = ref.current?.files;
    const file = files && 0 < files.length ? files[0] : null;
    if (file) {
      if (processedData && 0 < processedData.length) {
        setResetDataFoo(() => () => {
          resetFileState();
          setReservedData(fileName);
          setParsingData(true);
          setFileToParse(file);
          setFileName(file.name);
          setOpenUploadPopup(!openUploadPopup);
          setShowConfirmationModal(false);
        });
        setShowConfirmationModal(true);
      } else {
        resetFileState();
        setReservedData(fileName);
        setParsingData(true);
        setFileToParse(file);
        setFileName(file.name);
        setOpenUploadPopup(!openUploadPopup);
      }
    }
  };

  const handleChangePagination = (e: MouseEvent, {activePage}: PaginationProps) =>
    setPaginationPage('number' === typeof activePage ? activePage : 1);

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

  const renderContent = () => (
    <>
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
                <div className='scrollableTable'>
                  <Table
                    celled={true}
                    structured={true}
                  >
                    <Table.Header>
                      {renderHeader()}
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

  const renderMainModal = () => (
    <Modal.Modal
      onClose={handleCansel}
      onOpen={() => setOpenUploadPopup(true)}
      open={openUploadPopup}
      dimmer={'inverted'}
    >
      <Modal.Content>
        {renderContent()}
      </Modal.Content>
      <Modal.Actions>
        <Button
          style={{
            fontSize: '17px',
            textTransform: 'capitalize',
          }}
          onClick={handleCansel}
          content={'Cancel'}
        />
        <Button
          style={{
            fontSize: '17px',
            textTransform: 'capitalize',
          }}
          primary={!!processedData}
          disabled={!processedData}
          onClick={handleSave}
          content={'Apply'}
        />
      </Modal.Actions>
    </Modal.Modal>
  );

  const renderConfirmationModal = () => (
    <Modal.Modal
      onClose={() => setShowConfirmationModal(false)}
      onOpen={() => setShowConfirmationModal(true)}
      open={showConfirmationModal}
      dimmer={'inverted'}
    >
      <Modal.Content>
        <DataGrid>
          <DataRow>
            <h2 style={{color: '#BF1E1E'}}>Warning:</h2>
            <p style={{fontSize: '17px'}}> Data already exists. Overwrite?</p>
          </DataRow>
          <div className={styles.buttonGroup}>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
              }}
              onClick={() => {
                setShowConfirmationModal(false);
              }}
            >
              No
            </Button>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
              }}
              primary={true}
              onClick={() => resetDataFoo()}
            >
              Yes
            </Button>
          </div>
        </DataGrid>
      </Modal.Content>
    </Modal.Modal>
  );

  return (
    <>
      <div className={styles.fileUpload}>
        <div>
          <label htmlFor="fileUploadId">Upload file</label>
          <input
            id="fileUploadId"
            ref={ref}
            onChange={handleUploadFile}
            name="file"
            type="file"
            accept="text/csv"
          />
          <span>{fileName ? fileName : 'No file selected.'}</span>
        </div>
        <Button
          className='buttonLink'
          onClick={handleDownloadTemplate}
        >
          Download template <FontAwesomeIcon icon={faDownload}/></Button>
      </div>
      {renderConfirmationModal()}
      {renderMainModal()}
    </>
  );
};

export default UploadCSVFile;
