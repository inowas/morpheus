import {render, screen} from '@testing-library/react';
import React from 'react';
import NotFound from './NotFound';

describe('NotFound Tests', () => {
  test('It renders a NotFound', async () => {
    render(
      <NotFound/>,
    );
    expect(screen.getByTestId('notFound')).toBeInTheDocument();
  });
});
