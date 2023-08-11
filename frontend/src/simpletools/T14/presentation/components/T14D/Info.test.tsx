import React from 'react';
import {render, screen} from '@testing-library/react';
import Info from './InfoT14D';
import {defaults} from '../../containers/T14DContainer';

describe('Info Tests', () => {
  test('It renders the component', async () => {
    render(
      <Info parameters={defaults.parameters}/>,
    );

    expect(screen.getByTestId('info-container')).toBeInTheDocument();
  });
});
