import {render, screen} from '@testing-library/react';
import React from 'react';
import HintPageComponent from './HintPageComponent';
import icon from './icon_integrations.svg';


describe('HintPageComponent Tests', () => {
  test('It renders a HintPageComponent', async () => {
    render(
      <HintPageComponent
        image={icon}
        header="header"
      >
        <div>text-1234</div>
      </HintPageComponent>,
    );
    expect(screen.getByTestId('hint-page-component')).toBeInTheDocument();
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('text-1234')).toBeInTheDocument();
  });
});
