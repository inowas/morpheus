import {Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';


interface IProps {
  value: number;
  isReadOnly: boolean;
  onChange: (value: number) => void;
  label: string;
  description?: string | JSX.Element;
  precision?: number;
  isScientificNotation?: boolean;
}


const NumberInput = ({value, isReadOnly, onChange, label, description, precision = 3, isScientificNotation = false}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(value.toString());

  useEffect(() => {
    if (isScientificNotation) {
      return setValueLocal(value.toExponential());
    }

    return setValueLocal(value.toString());
    // eslint-disable-next-line
  }, [value]);

  const sanitizeValue = (v: string) => {
    if (isScientificNotation) {
      return v.replace(/[^0-9-+.,e]/g, '');
    }

    return v.replace(/[^0-9-.,]/g, '');
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

    if (isScientificNotation) {
      setValueLocal(parsed.toExponential());
      return onChange(parsed);
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
        onChange={(_, data) => setValueLocal(sanitizeValue(data.value))}
        onBlur={handleBlur}
        readOnly={isReadOnly}
      />
    </Form.Field>
  );
};

export default NumberInput;