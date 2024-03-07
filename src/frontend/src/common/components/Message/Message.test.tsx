import {render, screen} from '@testing-library/react';

import Message from './Message';
import React from 'react';

describe('Message Tests', () => {
  test('It renders a Message', async () => {
    render(
      <Message data-testid={'Message'}/>,
    );
    expect(screen.getByTestId('Message')).toBeInTheDocument();
  });
});
