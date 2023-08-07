import React from 'react';
import {render, screen} from '@testing-library/react';
import Breadcrumb from './Breadcrumb';

describe('Button Tests', () => {
  test('It renders a button', async () => {
    render(
      <Breadcrumb data-testid={'test-button'}/>,
    );

    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });
});

