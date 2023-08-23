import React from 'react';
import {render, screen} from '@testing-library/react';
import Info from './Info';
import {defaults} from '../containers/T08Container';


describe('Info Tests', () => {
  test('It renders the component', async () => {
    render(
      <Info parameters={defaults.parameters} settings={defaults.settings}/>,
    );
    expect(screen.getByTestId('info-container')).toBeInTheDocument();
  });
});
