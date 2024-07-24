import {Form} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';


interface IProps {
  value: number;
  isReadOnly: boolean;
  onChange: (number: number) => void;
  isDisabled?: boolean;
  textAlign?: 'left' | 'right' | 'center';
  precision?: number;
}

const DateInput = ({value, isReadOnly, onChange, isDisabled, precision = 2, textAlign = 'left'}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(value.toFixed(precision));

  useEffect(() => {
    setValueLocal(value.toFixed(precision));
  }, [value]);

  const sanitizeValue = (v: string) => v.replace(/[^0-9-.,]/g, '');

  const handleBlur = () => {
    const parsed = parseFloat(valueLocal);
    if (isNaN(parsed)) {
      setValueLocal(value.toFixed(precision));
      return;
    }

    const rounded = Math.round(parsed * Math.pow(10, precision)) / Math.pow(10, precision);
    setValueLocal(rounded.toFixed(precision));
    onChange(rounded);
  };

  return (
    <Form.Input
      size={'small'}
      type="text"
      value={valueLocal}
      onChange={(_, {value: v}) => setValueLocal(sanitizeValue(v))}
      onBlur={handleBlur}
      readOnly={isReadOnly}
      disabled={isDisabled}
      style={{width: '100px'}}
    >
      <input style={{textAlign}}/>
    </Form.Input>
  );
};

export default DateInput;
