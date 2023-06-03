import {render, screen} from '@testing-library/react';
import React from 'react';
import HintPageComponent from '../HintPageComponent';
import logo from './logo.png';


describe('HintPageComponent Tests', () => {
  test('It renders a HintPageComponent', async () => {
    render(
      <HintPageComponent
        image={logo}
        header="header"
      >
        <p>text-1234</p>
      </HintPageComponent>,
    );
    expect(screen.getByTestId('hint-page-component')).toBeInTheDocument();
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('text-1234')).toBeInTheDocument();
  });
});
