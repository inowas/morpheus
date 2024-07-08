import {Form} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';


interface IProps {
  value: string;
  isReadOnly: boolean;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  isValid?: (value: string) => boolean;
  textAlign?: 'left' | 'right' | 'center';
}

const DateInput = ({value, isReadOnly, onChange, isDisabled, isValid = () => true, textAlign = 'left'}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(value);

  useEffect(() => {
    setValueLocal(value);
  }, [value]);

  const handleBlur = () => {
    if (!isValid(valueLocal)) {
      setValueLocal(value);
      return;
    }

    onChange(valueLocal);
  };

  return (
    <Form.Input
      size={'small'}
      type="text"
      value={valueLocal}
      onChange={(_, {value: v}) => setValueLocal(v)}
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
