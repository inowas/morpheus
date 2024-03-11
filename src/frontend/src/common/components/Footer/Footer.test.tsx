import {render, screen} from '@testing-library/react';

import Footer from './Footer';
import React from 'react';

describe('Footer Tests', () => {
  test('It renders a Footer', async () => {
    render(
      <Footer release={'Your Release Version'}/>,
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
