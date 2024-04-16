import React, {useState} from 'react';
import {ECsvColumnType, StressperiodsUploadModal} from './index';
import {Button, CsvFileInput} from 'common/components';
import {Container} from 'semantic-ui-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {format} from 'date-fns';
import Papa from 'papaparse';
import {IColumn} from './types/StressperiodsUpload.type';
import {IStressPeriod} from '../../../../types';

interface IProps {
  onSubmit: (stressPeriods: IStressPeriod[]) => void;
}

const columns: IColumn[] = [
  {value: 'start_date_time', text: 'Start date', type: ECsvColumnType.DATE_TIME, default: 'Invalid Date'},
  {value: 'number_of_time_steps', text: 'Time steps', type: ECsvColumnType.INTEGER, default: '-'},
  {value: 'time_step_multiplier', text: 'Multiplier', type: ECsvColumnType.FLOAT, default: '-'},
  {value: 'steady_state', text: 'Steady state', type: ECsvColumnType.BOOLEAN, default: '-'},
];

const StressperiodsUpload = ({onSubmit}: IProps) => {

  const [csvRawData, setCsvRawData] = useState<any[][] | null>(null);

  const handleDownloadTemplate = () => {
    const filename = 'stressperiods.csv';
    const todayDate = format(new Date(), 'dd.MM.yyyy');
    const templateText = `start_date_time;nstp;tsmult;steady\n${todayDate};1;1;1\n`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(templateText));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
  };

  const handleSubmit = (stressPeriods: IStressPeriod[]) => {
    onSubmit(stressPeriods);
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
    }}
    >
      {/*// Component to upload and parse a CSV file*/}
      {/*// Could have a checkbox to treat the first row as header*/}
      <CsvFileInput onChange={handleCsvFileInputChange}/>

      {/*// Button to download a template CSV file*/}
      {/*// This should trigger a download of a CSV file for the currently defined stress periods*/}
      {/*// The trigger is in this component, the file is created in the parent component or the stress periods object has to be injected here*/}
      <Button className='buttonLink' onClick={handleDownloadTemplate}>
        Download template
        <FontAwesomeIcon icon={faDownload}/>
      </Button>

      {csvRawData && <StressperiodsUploadModal
        columns={columns}
        rawData={csvRawData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />}

    </Container>
  );
};


export default StressperiodsUpload;
