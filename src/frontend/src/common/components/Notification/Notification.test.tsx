import {render, screen} from '@testing-library/react';

import Notification from './Notification';
import React from 'react';

describe('Notification Tests', () => {
  test('It renders a Notification', async () => {
    render(
      <Notification data-testid={'notification'}/>,
    );
    expect(screen.getByTestId('notification')).toBeInTheDocument();
  });
});
