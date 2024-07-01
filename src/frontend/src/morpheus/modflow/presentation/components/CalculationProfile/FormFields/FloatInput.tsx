import {Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React, {useState} from 'react';


interface IProps {
  value: number | null;
  isReadOnly: boolean;
  onChange: (value: number | null) => void;
  label: string;
  description?: string | JSX.Element;
  precision?: number;
}


const FloatInput = ({value, isReadOnly, onChange, label, description, precision = 3}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(null === value ? '' : value.toString());

  const isScientificNotation = (inputValue: string) => {
    // Regular expression to match scientific notation format
    return /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(inputValue);
  };
  const round = (v: number, p: number) => {
    const d = Math.pow(10, p);
    return Math.round(v * d) / d;
  };

  const handleChange = (v: string) => {

    if (isScientificNotation(v)) {
      const parsedValue = parseFloat(v);
      if (isNaN(parsedValue)) {
        setValueLocal(null === value ? '' : value.toString());
        return;
      } else {
        setValueLocal(v);
        onChange(parsedValue);
      }
    } else {
      const parsed = parseFloat(v);
      if (isNaN(parsed)) {
        setValueLocal(null === value ? '' : value.toString());
        return;
      }
      setValueLocal(round(parsed, precision).toString());
      onChange(round(parseFloat(v) || 0, precision));
    }
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
        onBlur={() => handleChange(valueLocal)}
        readOnly={isReadOnly}
      />
    </Form.Field>
  );
};

export default FloatInput;
