import {Input} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';


interface IProps {
  value: string;
  isReadOnly: boolean;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

const DataTableInput = ({value, isReadOnly, onChange, isDisabled}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(value);

  useEffect(() => {
    setValueLocal(value);
  }, [value]);

  const sanitizeValue = (value: string) => {
    return value.replace(/[^0-9-.]/g, '');
  };

  const isScientificNotation = (inputValue: string) => {
    // Regular expression to match scientific notation format
    return /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(inputValue);
  };

  const handleBlur = () => {
    const sanitized = sanitizeValue(valueLocal);
    setValueLocal(sanitized);
    onChange(sanitized);
  };

  return (
    <Input
      width={1}
      size={'small'}
      type="text"
      value={valueLocal}
      onChange={(_, {value}) => setValueLocal(value)}
      onBlur={handleBlur}
      readOnly={isReadOnly}
      disabled={isDisabled}
      style={{width: '100px'}}
    >
      <input style={{textAlign: 'right'}}/>
    </Input>
  );
};

export default DataTableInput;
