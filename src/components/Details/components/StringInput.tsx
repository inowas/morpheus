import React, {ChangeEvent} from 'react';
import {Form, SemanticWIDTHS} from 'semantic-ui-react';

interface IProps {
  value: string;
  readOnly: boolean;
  width: SemanticWIDTHS;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

export default ({readOnly, value, width, onChange, label, error, ...rest}: IProps) => {

  const handleOnChange = (e: ChangeEvent, data: { value: string }) => {
    onChange(data.value);
  };

  return (
    <Form.Input
      type="text"
      value={value}
      label={label}
      error={error}
      readOnly={readOnly}
      width={width}
      onChange={handleOnChange}
      fluid={true}
      {...rest}
    />
  );
};
