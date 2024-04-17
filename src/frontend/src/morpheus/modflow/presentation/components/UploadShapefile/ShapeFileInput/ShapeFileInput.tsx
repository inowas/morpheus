import React from 'react';
import styles from './ShapeFileInput.module.less';
import {useDropzone} from 'react-dropzone';
import {Button, Message} from 'common/components';
import JSZip from 'jszip';

interface IShapeFileInput {
  onSubmit: (zipFile: File) => void;
  error?: string;
  fileName?: string;
}

const ShapeFileInput = ({onSubmit, error, fileName}: IShapeFileInput) => {

  const handleAcceptedFiles = async (files: File[]) => {
    // Check if the file is a zip file and return this file directly
    const zipFile = files.find((file) => file.name.endsWith('.zip'));
    if (zipFile) {
      onSubmit(zipFile);
    }

    // if no zip file is found, compress the files and upload the zip file
    if (!zipFile) {

      const zip = new JSZip();
      files.forEach((file) => zip.file(`${file.name}`, file));
      const zipContent = await zip.generateAsync({type: 'blob'});
      const file = new File([zipContent], 'shapefile.zip', {type: 'application/zip'});
      onSubmit(file);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    await handleAcceptedFiles(acceptedFiles);
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-esri-shape': ['.shp', '.shx', '.dbf', '.prj', '.cpg', '.qmd', '.sbn', '.sbx', '.shx'],
    },
  });

  return (
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
        <p>Supported file extensions: ESRI shapefile (.shp, .shx, .dbf, .prj,)</p>
        <p>Maximum file size: 20 MB</p>
      </div>
      {error && (
        <Message
          negative={true}
          compact={true}
          size={'small'}
        >
          <p>{error}</p>
        </Message>
      )}
      {fileName && (
        <Message
          compact={true}
          size={'small'}
        >
          <p>File selected: {fileName}</p>
        </Message>
      )}
    </div>
  );
};

export default ShapeFileInput;
