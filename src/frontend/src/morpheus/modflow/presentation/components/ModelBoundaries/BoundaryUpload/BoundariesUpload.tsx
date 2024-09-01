import React, {useState} from 'react';
import {BoundariesUploadModal} from './index';
import {Button, CsvFileInput} from 'common/components';
import {Container} from 'semantic-ui-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';
import {IStressPeriod} from '../../../../types';
import {IColumn} from '../BoundaryDataTable/DataTable';

interface IProps {
  columns: IColumn[];
  stressPeriods?: IStressPeriod[];
  onSubmit: (stressPeriods: IStressPeriod[]) => void;
}

// const columns = [
//   {value: 'start_date_time', text: 'Start date', type: ECsvColumnType.DATE_TIME, default: 'Invalid Date'},
//   {value: 'number_of_time_steps', text: 'Time steps', type: ECsvColumnType.INTEGER, default: '-'},
//   {value: 'time_step_multiplier', text: 'Multiplier', type: ECsvColumnType.FLOAT, default: '-'},
//   {value: 'steady_state', text: 'Steady state', type: ECsvColumnType.BOOLEAN, default: '-'},
// ];

const BoundariesUpload = ({stressPeriods, columns, onSubmit}: IProps) => {

  const [csvRawData, setCsvRawData] = useState<any[][] | null>(null);

  // Download template dependent f boundary type
  const handleDownloadTemplate = () => {
    console.log('handleDownloadTemplate');
    // const csv = Papa.unparse({
    //   fields: ['start_date_time', 'number_of_time_steps', 'time_step_multiplier', 'steady_state'],
    //   data: stressPeriods.map((sp) => (
    //     [sp.start_date_time, sp.number_of_time_steps, sp.time_step_multiplier, sp.steady_state]
    //   )),
    // });
    //
    // const mimeType = 'text/csv';
    // const blob = new Blob([csv], {type: `${mimeType};charset=utf-8`});
    // const link = document.createElement('a');
    //
    // if (undefined === link.download) {
    //   return;
    // }
    // const url = URL.createObjectURL(blob);
    // link.setAttribute('href', url);
    // link.setAttribute('download', 'stressperiods.csv');
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const handleCsvFileInputChange = (csvFile: File) => {
    Papa.parse(csvFile, {
      skipEmptyLines: true,
      complete: results => {
        if (0 < results.errors.length) {
          console.error('Error parsing CSV file', results.errors);
        }

        if (0 < results.data.length) {
          setCsvRawData(results.data as any[][]);
        }
      },
    });
    console.log(' csvFile from handleCsvFileInputChange', csvFile);
  };

  const handleSubmit = (uploadedBoundaries: any) => {
    console.log('On submit boundaries ', uploadedBoundaries);
  };

  const handleCancel = () => {
    setCsvRawData(null);
  };

  return (
    <Container style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      flexWrap: 'wrap',
      marginBottom: '20px',
    }}
    >
      {/*// Component to upload and parse a CSV file*/}
      {/*// Could have a checkbox to treat the first row as header*/}
      <CsvFileInput
        onChange={handleCsvFileInputChange}
        content={'Upload CSV'}
        primary={true}
        labelPosition={'left'}
        size={'tiny'}
        icon={'plus'}
        content={'Upload CSV file'}
      >
      </CsvFileInput>

      {/*// Button to download a template CSV file*/}
      {/*// This should trigger a download of a CSV file for the currently defined stress periods*/}
      {/*// The trigger is in this component, the file is created in the parent component or the stress periods object has to be injected here*/}
      <Button
        onClick={handleDownloadTemplate}
        secondary={true}
        labelPosition={'left'}
        size={'tiny'}
        icon={'download'}
        content={'Download template'}
      >
      </Button>

      {csvRawData && <BoundariesUploadModal
        columns={columns}
        rawData={csvRawData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />}
    </Container>
  );
};


export default BoundariesUpload;
