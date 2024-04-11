import React, {useState} from 'react';
import {ECsvColumnType, StressperiodsUploadModal} from './index';
import {Button, Modal, UploadCsvComponent} from 'common/components';
import {Container} from 'semantic-ui-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {format} from 'date-fns';

interface IProps {
  onSave: (data: any) => void;
}

const StressperiodsUpload = ({onSave}: IProps) => {

  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<any>(null);

  const handleDownloadTemplate = () => {
    console.log('Download template');
    const filename = 'stressperiods_template.csv';
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
  const handleSubmit = (processedData: any[][] | null) => {
    setFileName(uploadedData?.name);
    onSave(processedData);
  };
  const handleCancel = () => {
    setUploadedData(null);
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
      <UploadCsvComponent
        fileName={fileName}
        onUpload={setUploadedData}
      />
      <Button
        className='buttonLink'
        onClick={handleDownloadTemplate}
      >
        Download template
        <FontAwesomeIcon icon={faDownload}/>
      </Button>
      <Modal.Modal
        open={!!uploadedData}
        onClose={handleCancel}
        dimmer={'inverted'}
      >
        <Modal.Content>
          <StressperiodsUploadModal
            data={uploadedData}
            columns={[
              {key: 0, value: 'start_date_time', text: 'Start date', type: ECsvColumnType.DATE_TIME},
              {key: 1, value: 'nstp', text: 'Time steps'},
              {key: 2, value: 'tsmult', text: 'Multiplier'},
              {key: 3, value: 'steady', text: 'Steady state', type: ECsvColumnType.BOOLEAN},
            ]}
            onSave={handleSubmit}
            onCancel={handleCancel}
          />
        </Modal.Content>
      </Modal.Modal>
    </Container>
  );
};


export default StressperiodsUpload;
