import {render, screen} from '@testing-library/react';

import Button from './Button';
import React from 'react';

describe('Button Tests', () => {
  test('It renders a button', async () => {
    render(
      <Button data-testid={'test-button'}/>,
    );

    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });
});

