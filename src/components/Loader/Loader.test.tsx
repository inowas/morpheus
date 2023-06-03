import {render, screen} from '@testing-library/react';
import React from 'react';
import Loader from './Loader';

describe('Loader Tests', () => {
  test('It renders a Loader', async () => {
    render(
      <Loader data-testid={'loader'}/>,
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
