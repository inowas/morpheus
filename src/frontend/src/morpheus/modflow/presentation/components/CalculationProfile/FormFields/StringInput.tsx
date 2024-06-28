import {Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React from 'react';


interface IProps {
  value: string;
  isReadOnly: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string | JSX.Element;
  style?: React.CSSProperties;
}


const StringInput = ({value, isReadOnly, onChange, label, description, style}: IProps) => {
  return (
    <Form.Field style={style}>
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
        type='text'
        value={value}
        onChange={(_, data) => onChange(data.value)}
        readOnly={isReadOnly}
      />
    </Form.Field>
  );
};

export default StringInput;
