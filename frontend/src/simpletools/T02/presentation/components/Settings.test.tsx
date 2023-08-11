import React from 'react';
import {render, screen} from '@testing-library/react';
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

    // eslint-disable-next-line testing-library/no-node-access
    const radioX = screen.getByTestId('x-axis-radio').firstElementChild as HTMLInputElement;
    expect(radioX.checked).toBe(true);

    // eslint-disable-next-line testing-library/no-node-access
    const radioY = screen.getByTestId('y-axis-radio').firstElementChild as HTMLInputElement;
    expect(radioY.checked).toBe(false);

    act(() => {
      radioY.click();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({variable: 'y'});
  });
});
