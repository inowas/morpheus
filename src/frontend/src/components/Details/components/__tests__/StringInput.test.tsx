import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import StringInput from '../StringInput';

describe('String component', () => {
  test('renders a given string value', () => {
    const value = `text_${Math.random()}`;
    const readOnly = false;
    const onChange = jest.fn();

    render(
      <StringInput
        label={'label'}
        value={value}
        readOnly={readOnly}
        width="eight"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(value);
  });

  test('applies onChange correctly', () => {
    const value = 'text';
    const readOnly = false;
    const onChange = jest.fn();

    render(
      <StringInput
        label={'label'}
        value={value}
        readOnly={readOnly}
        width="eight"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(value);

    const newValue = `text_${Math.random()}`;
    fireEvent.change(input, {target: {value: newValue}});
    expect(onChange).toBeCalledWith(newValue);
  });
});
