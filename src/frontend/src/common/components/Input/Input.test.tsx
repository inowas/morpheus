import {render, screen} from '@testing-library/react';

import Input from './Input';
import React from 'react';

describe('Input Tests', () => {
  test('It renders a Input', async () => {
    render(
      <Input data-testid={'input'}/>,
    );
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });
});
