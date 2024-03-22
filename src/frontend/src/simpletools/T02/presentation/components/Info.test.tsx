import {render, screen} from '@testing-library/react';

import Info from './Info';
import React from 'react';
import {defaults} from '../containers/T02Container';

const mounding = {
  calculateHi: jest.fn().mockReturnValue(1),
  calculateHMax: jest.fn().mockReturnValue(1),
};

describe('Info Tests', () => {
  test('It renders the component', async () => {
    render(
      <Info parameters={defaults.parameters} mounding={mounding}/>,
    );

    expect(screen.getByTestId('info-container')).toBeInTheDocument();
  });
});
