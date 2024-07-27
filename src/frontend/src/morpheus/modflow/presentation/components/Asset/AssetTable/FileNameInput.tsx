import {Form, Input} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';


interface IProps {
  value: string;
  isReadOnly: boolean;
  onChange: (value: string) => void;
}

const FileNameInput = ({value, isReadOnly, onChange}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(value);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setValueLocal(value);
  }, [value]);

  const handleSubmit = () => {
    setIsEditing(false);
    onChange(valueLocal);
  };

  if (!isEditing) {
    return <div onClick={() => setIsEditing(true)}>{valueLocal}</div>;
  }

  return (

    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Input
          type="text"
          value={valueLocal}
          onChange={(_, {value: v}) => setValueLocal(v)}
          readOnly={isReadOnly}
        />
        <Form.Button
          icon={'check'}
          onClick={handleSubmit}
          type={'submit'}
        />
      </Form.Group>
    </Form>
  );
};

export default FileNameInput;


