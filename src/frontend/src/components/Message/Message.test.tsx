import {render, screen} from '@testing-library/react';
import React from 'react';
import Message from './Message';

describe('Message Tests', () => {
  test('It renders a Message', async () => {
    render(
      <Message data-testid={'Message'}/>,
    );
    expect(screen.getByTestId('Message')).toBeInTheDocument();
  });
});
