import {Form, Icon, Label, Popup} from 'semantic-ui-react';
import React from 'react';
import {DropdownComponent} from 'common/components';


interface IProps {
  value: any;
  onChange: (value: any) => void;
  options: { key: string, value: any, text: string }[];
  label?: string;
  isReadOnly: boolean;
  description?: string | JSX.Element;
  style?: React.CSSProperties;
}


const DropdownInput = ({value, isReadOnly, onChange, label, description, options, style}: IProps) => {
  return (
    <Form.Field style={style}>
      {label && <Label htmlFor={label} className="labelSmall">
        {description && <Popup
          trigger={<Icon name="info circle"/>}
          content={description}
          hideOnScroll={true}
          size="tiny"
        />}
        {label}
      </Label>}
      <DropdownComponent.Dropdown
        disabled={isReadOnly}
        name={label}
        selection={true}
        value={value}
        options={options}
        onChange={(_, data) => onChange(data.value)}
      />
    </Form.Field>
  );
};

export default DropdownInput;
