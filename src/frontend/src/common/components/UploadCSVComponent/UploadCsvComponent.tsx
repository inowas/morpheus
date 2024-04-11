import React, {ChangeEvent} from 'react';
import styles from './UploadCsvComponent.module.less';

interface UploadCsvProps {
  onUpload: (data: File | null) => void;
  fileName: string | null;
}

const UploadCsvComponent = ({onUpload, fileName}: UploadCsvProps) => {


  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && 0 < files.length ? files[0] : null;
    if (file) {
      onUpload(file);
    }
  };


  return (
    <div className={styles.updateCSV}>
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
  );
};


export default UploadCsvComponent;
