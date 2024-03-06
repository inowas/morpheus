import React, {useState} from 'react';

import Button from 'components/Button/Button';
import {Message} from 'semantic-ui-react';
import styles from './UploadFile.module.less';

interface IUploadCSVFile {
  onClose?: () => void;
}

const UploadFile = ({onClose}: IUploadCSVFile) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && 0 < fileList.length) {
      const file = fileList[0];
      // Check if the file is a JSON file or ESRI Shapefile or GeoJSON
      const allowedExtensions = ['json', 'geojson', 'shp'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      if (allowedExtensions.includes(fileExtension)) {
        setSelectedFile(file);
        setErrorMessage('');
      } else {
        setSelectedFile(null);
        setErrorMessage('Unsupported file type. Please select a JSON, GeoJSON, or ESRI Shapefile.');
      }
    }
  };

  const handleUpload = () => {
    // Implement file upload logic here
    if (selectedFile) {
      // You can handle file upload or download logic here
      // For example, to initiate a download of the selected JSON file:
      const downloadUrl = URL.createObjectURL(selectedFile);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', selectedFile.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setErrorMessage('');
    onClose?.();
  };

  return (
    <div className={styles.uploadFileWrappe}>
      <div className={styles.uploadFile}>
        <div className={styles.uploadContent}>
          <h2 className={'h4'}>Upload File</h2>
          <label
            className={styles.fileLabel}
          >
            Select files
            <input
              className={styles.fileInput}
              type="file"
              accept=".json,.geojson,.shp"
              onChange={handleFileChange}
              ref={(fileInput) => {
                if (fileInput) fileInput.value = '';
              }}
            />
          </label>
          <p className={styles.description}>
            Supported file types: JSON, GeoJSON, ESRI Shapefile
          </p>
          {selectedFile && (
            <div>
              <p>Selected file: {selectedFile.name}</p>
            </div>
          )}
        </div>
        <span className={'required'}>*Download GeoJSON template</span>
        {errorMessage && (
          <Message negative={true}>
            <Message.Header>Error</Message.Header>
            <p>{errorMessage}</p>
          </Message>
        )}
      </div>
      <div className={styles.buttons}>
        <Button
          size={'small'}
          onClick={handleCancel}
        >Cancle</Button>
        <Button
          size={'small'}
          primary={true}
          onClick={handleUpload}
        >Upload</Button>
      </div>
    </div>
  );
};

export default UploadFile;
