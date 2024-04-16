import React, {useEffect, useState} from 'react';
import styles from './UploadFile.module.less';
import {FileWithPath, useDropzone} from 'react-dropzone';
import {Button, Message} from 'common/components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';

interface IUploadCSVFile {
  isCancelled: boolean;
  shapefile: FileWithPath | null;
  setShapefile: React.Dispatch<React.SetStateAction<FileWithPath | null>>;
}

const UploadFile = ({isCancelled, shapefile, setShapefile}: IUploadCSVFile) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    if (0 < acceptedFiles.length) {
      const file = acceptedFiles[0];
      const allowedExtensions = ['shp', 'shx', 'dbf', 'prj', 'csv'];
      const fileExtension = file.name.split('.').pop();
      if (allowedExtensions.includes(fileExtension as string)) {
        setShapefile(file);
        setErrorMessage('');
      } else {
        setErrorMessage('Unsupported file format. Please upload a valid shapefile.');
      }
    }
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  useEffect(() => {
    if (isCancelled) {
      setShapefile(null); // Reset shapefile in parent component
      setErrorMessage('');
    }
  }, [isCancelled]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.dropzone}>
        <div {...getRootProps()} >
          <Button
            style={{position: 'absolute', top: '20px', left: '20px'}}
            size={'tiny'}
          >Choose file</Button>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p className={'h4'}>Drop the files here ...</p> :
              <p className={'h4'}>Drag and drop a shapefile here</p>
          }
          <p>Supported file extensions: ESRI shapefile (.shp, .shx, .dbf, .prj, .csv)</p>
          <p>Maximum file size: 20 MB</p>
        </div>
        {errorMessage && (
          <Message
            negative={true}
            compact={true}
            size={'small'}
          >
            <p>{errorMessage}</p>
          </Message>
        )}
        {shapefile && (
          <Message
            compact={true}
            size={'small'}
          >
            <p>File selected: {shapefile.name}</p>
          </Message>
        )}
      </div>
      <Button
        className='buttonLink'
        size={'tiny'}
        onClick={() => console.log('Download template')}
      >
        Download template
        <FontAwesomeIcon icon={faDownload}/>
      </Button>
    </div>
  );
};

export default UploadFile;
