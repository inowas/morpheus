import {render, screen} from '@testing-library/react';

import Info from './Info';
import React from 'react';
import {defaults} from '../containers/T08Container';

const calculation = {
  calcC: jest.fn().mockReturnValue(1),
  calcCTau: jest.fn().mockReturnValue(1),
  calculateVx: jest.fn().mockReturnValue(1),
  calculateDL: jest.fn().mockReturnValue(1),
  calculateR: jest.fn().mockReturnValue(1),
  calculateDiagramData: jest.fn().mockReturnValue(1),
};
describe('Info Tests', () => {
  test('It renders the component', async () => {
    render(
      <Info
        parameters={defaults.parameters} settings={defaults.settings}
        calculation={calculation}
      />,
    );
    expect(screen.getByTestId('info-container')).toBeInTheDocument();
  });
});
