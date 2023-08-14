import React from 'react';
import {render, screen} from '@testing-library/react';
import Info from './InfoT14B';
import {defaults} from '../../containers/T14BContainer';

describe('Info Tests', () => {
  test('It renders the component', async () => {
    render(
      <Info parameters={defaults.parameters}/>,
    );

    expect(screen.getByTestId('info-container')).toBeInTheDocument();
  });
});
