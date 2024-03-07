import {render, screen} from '@testing-library/react';

import Alerts from '../index';
import {IAlert} from '../Alert.type';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Tests for Alerts Component', () => {
  it('renders null if no alert provided', () => {
    render(<Alerts
      alerts={[]}
      onClear={jest.fn()}
      translate={jest.fn()}
    />);
    expect(screen.queryByTestId('alerts')).not.toBeInTheDocument();
  });

  it('should render error message', async () => {
    const translate = (key: string) => key;
    const onClose = jest.fn();
    const alerts: IAlert[] = [
      {
        uuid: '9b142238-2dd3-47e3-8d42-9c65e913e8b0',
        type: 'error',
        messages: ['error-message-1'],
        delayMs: 1000,
      },
    ];

    render(<Alerts
      alerts={alerts} onClear={onClose}
      translate={translate}
    />);
    expect(screen.getByTestId('error-alert')).toBeInTheDocument();
    expect(screen.getByText('error-message-1')).toBeInTheDocument();
    const closeButton = screen.getByTestId('close-alert');
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('9b142238-2dd3-47e3-8d42-9c65e913e8b0');
  });

  it('should render success message', async () => {
    const translate = (key: string) => key;
    const onClose = jest.fn();
    const alerts: IAlert[] = [
      {
        uuid: 'dbcc78f8-f4f5-4f61-b024-5ad9abb85aa7',
        type: 'success',
        messages: ['success-message-1'],
        delayMs: 1000,
      },
    ];

    render(<Alerts
      alerts={alerts} onClear={onClose}
      translate={translate}
    />);
    expect(screen.getByTestId('success-alert')).toBeInTheDocument();
    expect(screen.getByText('success-message-1')).toBeInTheDocument();
    const closeButton = screen.getByTestId('close-alert');
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('dbcc78f8-f4f5-4f61-b024-5ad9abb85aa7');
  });

  it('can be closed', async () => {
    const translate = (key: string) => key;
    const onClose = jest.fn();
    const alerts: IAlert[] = [
      {
        uuid: '339eaef7-c8df-4760-aa0f-b813e6e9c138',
        type: 'success',
        messages: ['success-message-1'],
        delayMs: 1000,
      },
    ];

    render(<Alerts
      alerts={alerts}
      onClear={onClose}
      translate={translate}
    />);
    expect(screen.getByTestId('success-alert')).toBeInTheDocument();
    expect(screen.getByText('success-message-1')).toBeInTheDocument();
    const closeButton = screen.getByTestId('close-alert');
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('339eaef7-c8df-4760-aa0f-b813e6e9c138');

  });

  it('should render all-other message', async () => {
    const translate = (key: string) => key;
    const onClose = jest.fn();
    const alerts: IAlert[] = [
      {
        uuid: 'fa53adb5-62cd-4571-ad30-48e05a2473c2',
        type: 'info',
        messages: ['info-message-1'],
        delayMs: 1000,
      },
    ];

    render(<Alerts
      alerts={alerts}
      onClear={onClose}
      translate={translate}
    />);
    expect(screen.getByTestId('info-alert-type')).toBeInTheDocument();
    expect(screen.getByText('info-message-1')).toBeInTheDocument();
    const closeButton = screen.getByTestId('close-alert');
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('fa53adb5-62cd-4571-ad30-48e05a2473c2');
  });
});
