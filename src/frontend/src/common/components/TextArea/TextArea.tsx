import React from 'react';
import {TextArea as SemanticTextArea, TextAreaProps as SemanticTextAreaProps} from 'semantic-ui-react';

interface ITextAreaProps extends Omit<SemanticTextAreaProps, 'onChange' | 'onInput' | 'rows' | 'value'> {
  elementType?: React.ElementType;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>, data: { value: string }) => void;
  onInput?: (event: React.FormEvent<HTMLTextAreaElement>, data: { value: string }) => void;
  rows?: number | string;
  value?: string | number;
}

const TextArea: React.FC<ITextAreaProps> = ({
  elementType = 'textarea',
  onChange,
  onInput,
  rows,
  value,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const data = {value: event.target.value};
    if (onChange) {
      onChange(event, data);
    }
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const data = {value: event.currentTarget.value};
    if (onInput) {
      onInput(event, data);
    }
  };

  return (
    <SemanticTextArea
      as={elementType}
      onChange={handleChange}
      onInput={handleInput}
      rows={rows}
      value={value}
      {...props}
    />
  );
};

export default TextArea;
