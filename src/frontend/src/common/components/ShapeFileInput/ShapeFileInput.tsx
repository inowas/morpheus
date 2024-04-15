import React, {createRef, useState} from 'react';

import Button from 'common/components/Button/Button';
import JSZip from 'jszip';

interface IShapeFileInput {
  onChangeFile: (zipFile: File) => void;
}

/*
Component for uploading shape files as zip file
The user can select multiple files and the component will compress them into a zip file
or upload the zip file if it is already a zip file
 */
const ShapeFileInput = ({onChangeFile}: IShapeFileInput) => {

  const fileInputRef = createRef<HTMLInputElement>();

  const handleAcceptedFiles = async (files: File[]) => {
    // Check if the file is a zip file and return this file directly
    const zipFile = files.find((file) => file.name.endsWith('.zip'));
    if (zipFile) {
      onChangeFile(zipFile);
    }

    // if no zip file is found, compress the files and upload the zip file
    if (!zipFile) {
      const zip = new JSZip();
      files.forEach((file, idx) => zip.file(`${file.name}`, file));
      const zipContent = await zip.generateAsync({type: 'blob'});
      const file = new File([zipContent], 'shapefile.zip', {type: 'application/zip'});
      onChangeFile(file);
    }
  };

  return (
    <>
      <Button
        content={'Upload file'}
        onClick={() => fileInputRef.current?.click()}
        size={'tiny'}
      />
      <input
        ref={fileInputRef}
        type={'file'}
        multiple={true}
        hidden={true}
        onChange={async (e) => {
          const files = e.target.files;
          if (files) {
            await handleAcceptedFiles(Array.from(files));
          }
        }}
        accept={'.zip,.shp,.shx,.dbf,.prj,.cpg,.qmd,.sbn,.sbx,.shx'}
      />
    </>
  );
};

export default ShapeFileInput;
