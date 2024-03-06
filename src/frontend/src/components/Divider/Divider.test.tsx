import {render, screen} from '@testing-library/react';

import Divider from './Divider';
import React from 'react';

describe('Divider Tests', () => {
  test('It renders a Divider', async () => {
    render(
      <Divider data-testid={'divider'}/>,
    );
    expect(screen.getByTestId('divider')).toBeInTheDocument();
  });
});
