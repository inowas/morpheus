import {render, screen} from '@testing-library/react';

import Pagination from './Pagination';
import React from 'react';

describe('Pagination Tests', () => {
  test('It renders a Pagination', async () => {
    render(
      <Pagination totalPages={10} data-testid={'pagination'}/>,
    );
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
