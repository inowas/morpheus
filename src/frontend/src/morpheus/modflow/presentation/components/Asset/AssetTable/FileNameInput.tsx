import {Button, Form, Input, Label} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';


interface IProps {
  value: string;
  isReadOnly: boolean;
  onChange: (value: string) => void;
  edit: boolean;
  onChangeEdit: (edit: boolean) => void;
}

const FileNameInput = ({value, isReadOnly, onChange, edit, onChangeEdit}: IProps) => {

  const [valueLocal, setValueLocal] = useState<string>(value);

  useEffect(() => {
    setValueLocal(value);
  }, [value]);

  const handleSubmit = () => {
    if (onChangeEdit) {
      onChangeEdit(false);
    }
    onChange(valueLocal);
  };

  if (!edit) {
    return <div>{valueLocal}</div>;
  }

  const extension = valueLocal.split('.').pop();

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <Input
          type="text"
          value={valueLocal.split('.').shift()}
          label={extension}
          labelPosition={'right'}
          onChange={(_, {value: v}) => setValueLocal(`${v}.${extension}`)}
          readOnly={isReadOnly}
        >
          <input/>
          <Label>{`.${valueLocal.split('.').pop()}`}</Label>
          <Button
            type="submit"
            icon={'check'}
            floated={'right'}
          ></Button>
        </Input>
      </div>
    </Form>
  );
};

export default FileNameInput;


