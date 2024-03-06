import {render, screen, within} from '@testing-library/react';

import React from 'react';
import Settings from './Settings';
import {act} from '@testing-library/react-hooks';

const mockOnChange = jest.fn();

describe('Settings Tests', () => {

  test('It renders the component', async () => {
    const settings = {
      retardation: true,
      case: 1,
      infiltration: 2,
    };

    render(
      <Settings
        settings={settings}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByTestId('settings-container')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis-radio')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis-radio')).toBeInTheDocument();
    expect(screen.getByTestId('continuous-radio')).toBeInTheDocument();
    expect(screen.getByTestId('one-time-radio')).toBeInTheDocument();

    const radioX = within(screen.getByTestId('x-axis-radio')).getByRole('radio') as HTMLInputElement;
    expect(radioX.checked).toBe(false);

    const radioY = within(screen.getByTestId('y-axis-radio')).getByRole('radio') as HTMLInputElement;
    expect(radioY.checked).toBe(true);

    const continuous = within(screen.getByTestId('continuous-radio')).getByRole('radio') as HTMLInputElement;
    expect(continuous.checked).toBe(true);

    const oneTime = within(screen.getByTestId('one-time-radio')).getByRole('radio') as HTMLInputElement;
    expect(oneTime.checked).toBe(false);
  });

  test('Сhanges case setting when radioX button is clicked', async () => {

    const settings = {
      retardation: true,
      case: 1,
      infiltration: 2,
    };

    render(<Settings settings={settings} onChange={mockOnChange}/>);

    const radioX = within(screen.getByTestId('x-axis-radio')).getByRole('radio') as HTMLInputElement;
    expect(radioX.checked).toBe(false);

    mockOnChange.mockClear();
    act(() => {
      radioX.click();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({...settings, case: 2});

  });

  test('Сhanges case setting when radioY button is clicked', async () => {

    const settings = {
      retardation: true,
      case: 2,
      infiltration: 2,
    };

    render(<Settings settings={settings} onChange={mockOnChange}/>);

    const radioY = within(screen.getByTestId('y-axis-radio')).getByRole('radio') as HTMLInputElement;
    expect(radioY.checked).toBe(false);

    mockOnChange.mockClear();
    act(() => {
      radioY.click();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({...settings, case: 1});
  });

  test('Сhanges infiltration setting when one-time-radio button is clicked', async () => {

    const settings = {
      retardation: true,
      case: 2,
      infiltration: 2,
    };

    render(<Settings settings={settings} onChange={mockOnChange}/>);
    const oneTime = within(screen.getByTestId('one-time-radio')).getByRole('radio') as HTMLInputElement;
    expect(oneTime.checked).toBe(false);

    mockOnChange.mockClear();
    act(() => {
      oneTime.click();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({...settings, infiltration: 1});
  });

  test('Сhanges infiltration setting when continuous-radio button is clicked', async () => {

    const settings = {
      retardation: true,
      case: 2,
      infiltration: 1,
    };

    render(<Settings settings={settings} onChange={mockOnChange}/>);
    const continuous = within(screen.getByTestId('continuous-radio')).getByRole('radio') as HTMLInputElement;
    expect(continuous.checked).toBe(false);

    mockOnChange.mockClear();
    act(() => {
      continuous.click();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({...settings, infiltration: 2});
  });

});
