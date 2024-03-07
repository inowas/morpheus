import {render, screen} from '@testing-library/react';

import Checkbox from './Checkbox';
import React from 'react';

describe('Checkbox Tests', () => {
  test('It renders a Checkbox', async () => {
    render(
      <Checkbox data-testid={'checkbox'}/>,
    );
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });
});
