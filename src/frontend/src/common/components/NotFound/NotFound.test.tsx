import {render, screen} from '@testing-library/react';

import NotFound from './NotFound';
import React from 'react';

describe('NotFound Tests', () => {
  test('It renders a NotFound', async () => {
    render(
      <NotFound/>,
    );
    expect(screen.getByTestId('notFound')).toBeInTheDocument();
  });
});
