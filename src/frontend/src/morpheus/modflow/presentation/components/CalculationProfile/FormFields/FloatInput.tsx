import {Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';


interface IProps {
  value: number;
  isReadOnly: boolean;
  onChange: (value: number) => void;
  label: string;
  description?: string | JSX.Element;
  precision?: number;
}


const FloatInput = ({value, isReadOnly, onChange, label, description, precision = 3}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(value.toString());

  useEffect(() => {
    setValueLocal(value.toString());
  }, [value]);

  const isScientificNotation = (inputValue: string) => {
    // Regular expression to match scientific notation format
    return /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(inputValue);
  };
  const round = (v: number, p: number) => {
    const d = Math.pow(10, p);
    return Math.round(v * d) / d;
  };

  const handleBlur = () => {
    const parsed = parseFloat(valueLocal);
    if (isNaN(parsed)) {
      onChange(value);
    }

    if (isScientificNotation(valueLocal)) {
      setValueLocal(parsed.toString());
      onChange(parsed);
    }

    setValueLocal(round(parsed, precision).toString());
    onChange(round(parsed, precision));
  };

  return (
    <Form.Field>
      <Label
        htmlFor={label}
        className="labelSmall"
      >
        {description && <Popup
          trigger={<Icon name="info circle"/>}
          content={description}
          hideOnScroll={true}
          size="tiny"
        />}
        {label}
      </Label>
      <Input
        id={label}
        precision={precision}
        disabled={isReadOnly}
        type="text"
        value={valueLocal}
        onChange={(_, data) => setValueLocal(data.value)}
        onBlur={handleBlur}
        readOnly={isReadOnly}
      />
    </Form.Field>
  );
};

export default FloatInput;
