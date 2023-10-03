import React from 'react';
import {render, screen} from '@testing-library/react';
import ChartModal from './index';
import userEvent from '@testing-library/user-event';

describe('ChartModal component', () => {
  test('renders ChartModal', () => {
    const open = true;
    const onClose = jest.fn();
    const children = '';

    render(<ChartModal
      open={open}
      onClose={onClose}
      children={children}
    />);
    expect(screen.getByTestId('chartModal')).toBeInTheDocument();
  });

  test('modal close by click on button', async () => {
    const open = true;
    const onClose = jest.fn();
    const children = '';

    render(<ChartModal
      open={open} onClose={onClose}
      children={children}
    />);
    const modalButton = screen.getByTestId('modalButton');
    await userEvent.click(modalButton);
    expect(onClose).toHaveBeenCalled();
  });
});
