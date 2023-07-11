import {render, screen} from '@testing-library/react';
import React from 'react';
import Divider from './Divider';

describe('Divider Tests', () => {
  test('It renders a Divider', async () => {
    render(
      <Divider data-testid={'divider'}/>,
    );
    expect(screen.getByTestId('divider')).toBeInTheDocument();
  });
});
