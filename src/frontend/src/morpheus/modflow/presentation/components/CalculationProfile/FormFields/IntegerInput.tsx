import {Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React from 'react';


interface IProps {
  value: number;
  isReadOnly: boolean;
  onChange: (value: number) => void;
  label: string;
  description?: string | JSX.Element;
}


const IntegerInput = ({value, isReadOnly, onChange, label, description}: IProps) => {

  const handleChange = (v: string) => {
    onChange(parseInt(v, 10));
  };

  return (
    <Form.Field>
      <Label htmlFor={label} className="labelSmall">
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
        disabled={isReadOnly}
        type='number'
        value={value}
        onChange={(_, data) => handleChange(data.value)}
        readOnly={isReadOnly}
      />
      {/*<Input*/}
      {/*  id={label}*/}
      {/*  disabled={isReadOnly}*/}
      {/*  type='text'*/}
      {/*  value={value.toExponential()}*/}
      {/*  onChange={(_, data) => handleChange(data.value)}*/}
      {/*  readOnly={isReadOnly}*/}
      {/*/>*/}
    </Form.Field>
  );
};

export default IntegerInput;
