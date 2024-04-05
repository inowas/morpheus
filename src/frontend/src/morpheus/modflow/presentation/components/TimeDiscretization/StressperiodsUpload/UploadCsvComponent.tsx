import React, {ChangeEvent} from 'react';
import {Button} from 'common/components';
import styles from './StressperiodsUpload.module.less';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {format} from 'date-fns';


interface UploadCsvProps {
  onUpload: (data: File | null) => void;
  fileName?: string | null;
}

const UploadCsvComponent = ({onUpload, fileName}: UploadCsvProps) => {


  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && 0 < files.length ? files[0] : null;
    if (file) {
      onUpload(file);
    }
  };


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

  return (
    <div className={styles.fileUpload}>
      <div>
        <label htmlFor="fileUploadId">Upload file</label>
        <input
          id="fileUploadId"
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
  );
};


export default UploadCsvComponent;
