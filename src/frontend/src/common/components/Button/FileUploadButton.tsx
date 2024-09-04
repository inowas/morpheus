import React, {createRef} from 'react';
import Button from './Button';

interface IProps {
  buttonContent?: string,
  isReadOnly: boolean,
  loading: boolean,
  onSelectFiles: (files: File[]) => Promise<void>,
  acceptFiles?: string,
  style?: { padding: string }
}


const FileUploadButton = ({buttonContent, isReadOnly, loading, acceptFiles, onSelectFiles, style}: IProps) => {

  const fileInputRef = createRef<HTMLInputElement>();

  return (
    <>
      <Button
        primary={true}
        size={'tiny'}
        icon={'file'}
        labelPosition={'left'}
        content={buttonContent || 'Upload file'}
        onClick={() => fileInputRef.current?.click()}
        disabled={isReadOnly || loading}
      />
      <input
        ref={fileInputRef}
        type={'file'}
        multiple={true}
        hidden={true}
        onChange={async (e) => {
          const files = e.target.files;
          if (files) {
            await onSelectFiles(Array.from(files));
            e.target.value = '';
          }
        }}
        accept={acceptFiles}
        disabled={isReadOnly}
      />
    </>
  );
};

export default FileUploadButton;
