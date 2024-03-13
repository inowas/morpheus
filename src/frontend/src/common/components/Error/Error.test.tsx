import {render, screen} from '@testing-library/react';

import Error from './Error';
import React from 'react';

describe('Error Tests', () => {
  test('It renders a error', async () => {
    render(
      <Error/>,
    );
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });
});
