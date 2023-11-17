import {render, screen} from '@testing-library/react';
import React from 'react';
import Footer from './Footer';

describe('Footer Tests', () => {
  test('It renders a Footer', async () => {
    render(
      <Footer release={'Your Release Version'}/>,
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
