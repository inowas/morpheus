/* eslint-disable testing-library/no-node-access */
import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import DatePicker from './DatePicker';

describe('DatePicker Tests', () => {
  test('It renders the datepicker correctly', async () => {

    const onChangeDate = jest.fn();

    render(
      <DatePicker
        date={null}
        placeholder="Select a date"
        onChangeDate={onChangeDate}
        onChangeFocus={jest.fn()}
        formatDate={jest.fn()}
      />,
    );

    expect(screen.getByTestId('datepicker-input')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('datepicker-input').children[0]);
    await screen.findByTestId('datepicker-popup');
    expect(screen.getByTestId('datepicker-popup').firstChild).toHaveClass('rdrCalendarWrapper');
    setTimeout(() => {
      expect(screen.queryByTestId('datepicker-popup')).not.toBeInTheDocument();
    }, 200);
  });
});
