import {render, screen} from '@testing-library/react';

import IconButton from './IconButton';
import React from 'react';

describe('IconButton Tests', () => {
  test('It renders a IconButton', async () => {
    render(
      <IconButton data-testid={'test-button'}/>,
    );

    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });
});

