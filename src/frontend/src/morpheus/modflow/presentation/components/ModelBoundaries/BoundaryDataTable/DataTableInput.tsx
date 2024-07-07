import {Input} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {data} from 'browserslist';


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
      onChange={(_, {value: v}) => setValueLocal(v)}
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
