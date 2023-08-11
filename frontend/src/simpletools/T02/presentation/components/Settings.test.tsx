import React from 'react';
import {render, screen, within} from '@testing-library/react';
import Settings from './Settings';
import {act} from '@testing-library/react-hooks';

const mockOnChange = jest.fn();

describe('Settings Tests', () => {
  test('It renders the component', async () => {
    render(
      <Settings
        settings={{variable: 'x'}}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByTestId('settings-container')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis-radio')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis-radio')).toBeInTheDocument();

    const radioX = within(screen.getByTestId('x-axis-radio')).getByRole('radio') as HTMLInputElement;
    expect(radioX.checked).toBe(true);

    const radioY = within(screen.getByTestId('y-axis-radio')).getByRole('radio') as HTMLInputElement;
    expect(radioY.checked).toBe(false);

    mockOnChange.mockClear();
    act(() => {
      radioY.click();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({variable: 'y'});

    mockOnChange.mockClear();
    act(() => {
      radioY.click();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);

  });
});
