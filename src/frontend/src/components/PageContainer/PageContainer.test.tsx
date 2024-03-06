import {render, screen} from '@testing-library/react';

import PageContainer from './Page';
import React from 'react';

describe('PageContainer Tests', () => {
  test('It renders a PageContainer', async () => {
    render(
      <PageContainer data-testid={'page-container'}/>,
    );
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });
});
