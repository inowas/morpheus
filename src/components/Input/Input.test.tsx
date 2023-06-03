import {render, screen} from '@testing-library/react';
import React from 'react';
import Input from './Input';

describe('Input Tests', () => {
  test('It renders a Input', async () => {
    render(
      <Input data-testid={'input'}/>,
    );
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });
});
