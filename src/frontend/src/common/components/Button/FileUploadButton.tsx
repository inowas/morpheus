import React, {createRef} from 'react';
import Button from './Button';

interface IProps {
  buttonContent?: string;
  isReadOnly: boolean;
  loading: boolean;
  onSelectFiles: (files: File[]) => void;
  acceptFiles?: string;
}


const FileUploadButton = ({buttonContent, isReadOnly, loading, acceptFiles, onSelectFiles}: IProps) => {

  const fileInputRef = createRef<HTMLInputElement>();

  return (
    <>
      <Button
        primary={true}
        size={'tiny'}
        content={buttonContent || 'Upload file'}
        onClick={() => fileInputRef.current?.click()}
        disabled={isReadOnly || loading}
        style={{fontSize: '17px'}}
      />
      <input
        ref={fileInputRef}
        type={'file'}
        multiple={true}
        hidden={true}
        onChange={async (e) => {
          const files = e.target.files;
          if (files) {
            onSelectFiles(Array.from(files));
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
