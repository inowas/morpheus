import {render, screen} from '@testing-library/react';
import React from 'react';
import Checkbox from './Checkbox';

describe('Checkbox Tests', () => {
  test('It renders a Checkbox', async () => {
    render(
      <Checkbox data-testid={'checkbox'}/>,
    );
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });
});
