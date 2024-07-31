import {Input, Dropdown} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';

interface IProps {
  attribute: string | null;
  value: string | null;
  onChange: (attribute: string | null, value: string) => void;
  attributes: string[];
}

const ImportDataTableInput = ({attribute, attributes, value, onChange}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(value || '0.0');
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(attribute);

  useEffect(() => {
    setSelectedAttribute(attribute);
    if (value) {
      setValueLocal(value);
    }
  }, [attribute, value]);

  const handleChangeDropdown = (dropdownValue: string) => {
    const newAttribute = '' === dropdownValue ? null : dropdownValue;
    setSelectedAttribute(newAttribute);
    onChange(newAttribute, valueLocal);
  };

  const sanitizeValue = (v: string) => {
    return v.replace(/[^0-9-.]/g, '');
  };

  const handleBlur = () => {
    const sanitized = sanitizeValue(valueLocal);
    setValueLocal(sanitized);
    onChange(selectedAttribute, sanitized);
  };

  const dropdownOptions = [{
    key: 'none',
    value: 'none',
    text: 'No attribute',
  }, ...attributes.map((a) => ({key: a, value: a, text: a}))];

  const renderInputDropdown = () => {
    return (
      <Dropdown
        value={selectedAttribute || 'none'}
        options={dropdownOptions}
        onChange={(_, data) => handleChangeDropdown(data.value as string)}
      />
    );
  };

  return (
    <Input
      label={renderInputDropdown()}
      labelPosition={'left'}
      size={'small'}
      width={2}
      type="text"
      value={selectedAttribute ? '---' : valueLocal}
      onChange={(_, {value: v}) => setValueLocal(v)}
      onBlur={handleBlur}
      style={{width: '100px'}}
      readOnly={!!selectedAttribute}
    />
  );
};

export default ImportDataTableInput;
