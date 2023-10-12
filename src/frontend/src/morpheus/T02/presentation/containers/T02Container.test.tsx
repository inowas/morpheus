import React from 'react';
import {render, screen} from '@testing-library/react';
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
  useNavigate: () => () => {
    return;
  },
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
    expect(screen.getByTestId('t02-container')).toBeInTheDocument();
  });
});
