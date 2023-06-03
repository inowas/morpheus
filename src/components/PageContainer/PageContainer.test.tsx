import {render, screen} from '@testing-library/react';
import React from 'react';
import PageContainer from './Page';

describe('PageContainer Tests', () => {
  test('It renders a PageContainer', async () => {
    render(
      <PageContainer data-testid={'page-container'}/>,
    );
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });
});
