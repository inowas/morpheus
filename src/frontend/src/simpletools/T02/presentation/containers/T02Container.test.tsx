import {render, screen} from '@testing-library/react';

import React from 'react';
import T02Container from './T02Container';

// Mock window.Plotly
window.Plotly = {
  newPlot: jest.fn(),
};
jest.mock('../../application', () => ({
  useCalculateMounding: () => ({
    calculateHi: jest.fn().mockReturnValue(0.01),
    calculateHMax: jest.fn().mockReturnValue(0.01),
  }),
  useCalculateChartData: () => ({
    calculateChartData: jest.fn().mockResolvedValue({
      L: 1,
      W: 1,
      xData: [1],
      yData: [1],
      zData: [[1]],
    }),
  }),
  useNavigate: () => () => {
    return;
  },
  useShowBreadcrumbs: () => () => true,
  useTranslate: () => ({
    i18n: {
      changeLanguage: () => {
      },
    },
    translate: (key: string) => key,
    language: 'en',
  }),
}));

describe('Container Tests', () => {
  test('It renders the component', async () => {
    render(
      <T02Container/>,
    );

    await screen.findByTestId('t02-container');
    expect(screen.getByTestId('t02-container')).toBeInTheDocument();
  });
});
