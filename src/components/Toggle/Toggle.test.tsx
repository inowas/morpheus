import {render, screen} from '@testing-library/react';
import Toggle from './Toggle';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Toggle Tests', () => {
  const onChange = jest.fn();

  test('It renders a Toggle', async () => {
    render(
      <Toggle
        value={true} onChange={onChange}
        labelChecked={'Archiv'}
        labelUnchecked={'Bestand'}
      />,
    );
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });

  test('calls on Change', async () => {
    render(
      <Toggle
        value={true} onChange={onChange}
        labelChecked={'Archiv'}
        labelUnchecked={'Bestand'}
      />,
    );
    const toggle = screen.getByTestId('toggle');
    await userEvent.click(toggle);
    expect(onChange).toHaveBeenCalled();
  });
});
