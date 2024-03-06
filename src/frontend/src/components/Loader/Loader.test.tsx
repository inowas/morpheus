import {render, screen} from '@testing-library/react';

import Loader from './Loader';
import React from 'react';

describe('Loader Tests', () => {
  test('It renders a Loader', async () => {
    render(
      <Loader data-testid={'loader'}/>,
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
