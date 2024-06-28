import React, {ChangeEvent, useState} from 'react';
import styles from './CsvFileInput.module.less';

interface ICsvFileInput {
  content?: string;
  style?: React.CSSProperties;
  onChange: (csvFile: File) => void;
}

const CsvFileInput = ({onChange, style, content}: ICsvFileInput) => {

  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleOnChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return setError('No file selected');
    }
    const files = e.target.files;
    const file = files && 0 < files.length ? files[0] : null;
    if (null === file) {
      return setError('No file selected');
    }

    setFilename(file.name);
    onChange(file);
  };

  return (
    <div className={styles.updateCSV} style={{...style}}>
      <label htmlFor="fileUploadId">{content || 'Upload file'}</label>
      <input
        id="fileUploadId"
        onChange={handleOnChangeFile}
        name="file"
        type="file"
        accept="text/csv"
      />
      {/*{filename && <span>{filename}</span>}*/}
      {error && <span style={{color: 'red'}}>{error}</span>}
    </div>
  );
};


export default CsvFileInput;
