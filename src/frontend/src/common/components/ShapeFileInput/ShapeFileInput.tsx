import React, {createRef} from 'react';

import Button from 'common/components/Button/Button';

interface IShapeFileInput {
  onSubmit: (files: File[]) => void;
  error?: string;
  readOnly: boolean;
  icon?: string;
  content?: string;
}

/*
Component for uploading shape files as zip file
The user can select multiple files and the component will compress them into a zip file
or upload the zip file if it is already a zip file
 */
const ShapeFileInput = ({onSubmit, error, readOnly, icon, content}: IShapeFileInput) => {

  const fileInputRef = createRef<HTMLInputElement>();

  return (
    <>
      <Button
        content={!content && !icon ? 'Choose file' : content}
        onClick={() => fileInputRef.current?.click()}
        size={'tiny'}
        primary={true}
        labelPosition={'left'}
        icon={'file'}
        disabled={readOnly}
        style={{minWidth: 'auto', display: 'flex', alignItems: 'center'}}
      />
      {error && <div style={{color: 'red'}}>{error}</div>}
      <input
        ref={fileInputRef}
        type={'file'}
        multiple={true}
        hidden={true}
        onChange={async (e) => {
          const files = e.target.files;
          if (files) {
            onSubmit(Array.from(files));
            e.target.value = '';
          }
        }}
        accept={'.zip,.shp,.shx,.dbf,.prj,.cpg,.qmd,.sbn,.sbx,.shx'}
        disabled={readOnly}
      />
    </>
  );
};

export default ShapeFileInput;
