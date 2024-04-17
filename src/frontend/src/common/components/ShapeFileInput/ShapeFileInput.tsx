import React, {createRef} from 'react';
import {Button, Message} from 'common/components';
import JSZip from 'jszip';
import {useDropzone as useDropzoneHook} from 'react-dropzone';
import styles from './ShapeFileInput.module.less';

interface IShapeFileInput {
  useDropzone?: boolean;
  onSubmit: (zipFile: File) => void;
  error?: string;
  fileName?: string | null;
}

const ShapeFileInput = ({onSubmit, error, fileName = null, useDropzone = false}: IShapeFileInput) => {
  const fileInputRef = createRef<HTMLInputElement>();

  const handleAcceptedFiles = async (files: File[]) => {
    const zipFile = files.find((file) => file.name.endsWith('.zip'));
    if (zipFile) {
      onSubmit(zipFile);
    } else {
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

  const {getRootProps, getInputProps, isDragActive} = useDropzoneHook({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-esri-shape': ['.shp', '.shx', '.dbf', '.prj', '.cpg', '.qmd', '.sbn', '.sbx', '.shx'],
    },
  });

  return (
    <div className={!useDropzone ? styles.standardUpload : styles.dropzone}>
      {!useDropzone ? (
        <>
          <Button
            content="Upload Shapefile" onClick={() => fileInputRef.current?.click()}
            size="tiny"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple={true}
            hidden={true}
            onChange={async (e) => {
              const files = e.target.files;
              if (files) {
                await handleAcceptedFiles(Array.from(files));
              }
            }}
            accept=".zip,.shp,.shx,.dbf,.prj,.cpg,.qmd,.sbn,.sbx,.shx"
          />
        </>
      ) : (
        <div {...getRootProps()} className={styles.dropzoneContent}>
          <Button style={{position: 'absolute', top: '20px', left: '20px'}} size="tiny">
            Choose file
          </Button>
          <input {...getInputProps()} />
          {isDragActive ? <p className="h4">Drop the files here ...</p> : <p className="h4">Drag and drop a shapefile here</p>}
          <p>Supported file extensions: ESRI shapefile (.shp, .shx, .dbf, .prj)</p>
          <p>Maximum file size: 20 MB</p>
        </div>
      )}
      {error && (
        <Message
          negative={true} compact={true}
          size="small"
        >
          <p>{error}</p>
        </Message>
      )}
      {fileName && (
        <Message compact={true} size="small">
          <p>File selected: {fileName}</p>
        </Message>
      )}
    </div>
  );
};

export default ShapeFileInput;
