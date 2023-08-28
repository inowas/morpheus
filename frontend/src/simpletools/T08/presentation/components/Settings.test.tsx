import React from 'react';
import {render, screen, within} from '@testing-library/react';
import Settings from './Settings';
import {defaults} from '../containers/T08Container';

const mockOnChange = jest.fn();

describe('Settings Tests', () => {

  test('It renders the component', async () => {
    render(
      <Settings
        settings={defaults.settings}
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

  // test('Сhanges case setting when radio button is clicked', async () => {
  //
  //   render(<Settings settings={defaults.settings} onChange={mockOnChange}/>);
  //
  //   const radioX = within(screen.getByTestId('x-axis-radio')).getByRole('radio') as HTMLInputElement;
  //   expect(radioX.checked).toBe(false);
  //
  //   const radioY = within(screen.getByTestId('y-axis-radio')).getByRole('radio') as HTMLInputElement;
  //   expect(radioY.checked).toBe(true);
  //
  //
  //   act(() => {
  //     radioX.click();
  //   });
  //
  //   expect(mockOnChange).toHaveBeenCalledTimes(1);
  //   expect(mockOnChange).toHaveBeenCalledWith({...defaults.settings, case: 2});
  //
  //   // TODO: (Do we need to add test for second radioY?)
  //   // mockOnChange.mockClear();
  //   act(() => {
  //     radioY.click();
  //   });
  //   expect(mockOnChange).toHaveBeenCalledTimes(1);
  //   // TODO: change case to 1 (DO we need to change state (create default settings ? ))
  //   //  const settings = {
  //   //   retardation: true,
  //   //   case: 2,
  //   //   infiltration: 2,
  //   //   }
  //   expect(mockOnChange).toHaveBeenCalledWith({...defaults.settings, case: 2});
  //
  //
  // });
  //
  // test('Сhanges infiltration setting when radio button is clicked', async () => {
  //   render(<Settings settings={defaults.settings} onChange={mockOnChange}/>);
  //   // const continuous = within(screen.getByTestId('continuous-radio')).getByRole('radio') as HTMLInputElement;
  //   // expect(continuous.checked).toBe(true);
  //   const oneTime = within(screen.getByTestId('one-time-radio')).getByRole('radio') as HTMLInputElement;
  //   expect(oneTime.checked).toBe(false);
  //
  //   act(() => {
  //     oneTime.click();
  //   });
  //
  //   //TODO: (Test checks mockOnChange calls NOT only in this test?)
  //   expect(mockOnChange).toHaveBeenCalledTimes(2);
  //   expect(mockOnChange).toHaveBeenCalledWith({...defaults.settings, infiltration: 1});
  // });

});
