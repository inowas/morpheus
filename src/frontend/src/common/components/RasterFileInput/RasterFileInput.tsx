import React, {createRef} from 'react';

import Button from 'common/components/Button/Button';

interface IRasterFileInput {
  btnValue?: string;
  onSubmit: (file: File) => void;
  error?: string;
  readOnly: boolean;
}

/*
Component for uploading shape files as zip file
The user can select multiple files and the component will compress them into a zip file
or upload the zip file if it is already a zip file
 */
const RasterFileInput = ({onSubmit, error, readOnly, btnValue}: IRasterFileInput) => {

  const fileInputRef = createRef<HTMLInputElement>();

  const handleAcceptedFiles = async (files: File[]) => {
    const rasterFile = files.find((file) => file.name.endsWith('.geotiff') || file.name.endsWith('.tif') || file.name.endsWith('.tiff'));
    if (rasterFile) {
      onSubmit(rasterFile);
    }
  };

  return (
    <>
      <Button
        className={!btnValue ? 'no-content' : ''}
        content={btnValue || false}
        icon={'upload'}
        onClick={() => fileInputRef.current?.click()}
        disabled={readOnly}
        size={'tiny'}
        style={{minWidth: 'auto', display: 'flex', alignItems: 'center'}}
      />
      {error && <div style={{color: 'red'}}>{error}</div>}
      <input
        ref={fileInputRef}
        type={'file'}
        multiple={false}
        hidden={true}
        onChange={async (e) => {
          const files = e.target.files;
          if (files) {
            await handleAcceptedFiles(Array.from(files));
          }
        }}
        accept={'.geotiff,.tif,.tiff'}
        disabled={readOnly}
      />
    </>
  );
};

export default RasterFileInput;
