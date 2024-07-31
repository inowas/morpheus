import React from 'react';
import {Form, Icon, Popup} from 'common/components';

interface IProps {
  value: boolean
  isReadOnly: boolean;
  onChange: (value: boolean) => void
  label: string;
  description?: string | JSX.Element;
}

const CheckBox = ({value, label, onChange, isReadOnly, description}: IProps) => (
  <Form.FormField>
    <Form.Label htmlFor={label} className="labelSmall">
      {description && (
        <Popup
          trigger={<Icon name="info circle"/>}
          content={description}
          hideOnScroll={true}
          size="tiny"
        />)}
      {label}
    </Form.Label>
    <Form.Checkbox
      id={label}
      style={{minHeight: 'unset', alignItems: 'center'}}
      disabled={isReadOnly}
      toggle={true}
      toggleStyle={'colored'}
      toggleSize={'large'}
      checked={value}
      onChange={(_, {checked}) => onChange(checked || false)}
    />
  </Form.FormField>
);

export default CheckBox;
