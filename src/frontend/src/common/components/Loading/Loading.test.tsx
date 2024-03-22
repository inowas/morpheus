import {render, screen} from '@testing-library/react';

import Loading from './Loading';
import React from 'react';

describe('Loading Tests', () => {
  test('It renders a Loading', async () => {
    render(
      <Loading/>,
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
