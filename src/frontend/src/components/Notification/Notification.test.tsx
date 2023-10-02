import {render, screen} from '@testing-library/react';
import React from 'react';
import Notification from './Notification';

describe('Notification Tests', () => {
  test('It renders a Notification', async () => {
    render(
      <Notification data-testid={'notification'}/>,
    );
    expect(screen.getByTestId('notification')).toBeInTheDocument();
  });
});
