import React from 'react';
import {render, screen} from '@testing-library/react';
import T02Container from './T02Container';

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

// mock the react-plotly.js library, which fails to run server side
jest.mock('react-plotly.js', () => ({
  __esModule: true,
  default: jest.fn(() => <div/>),
}));

describe('Container Tests', () => {
  test('It renders the component', async () => {
    render(
      <T02Container/>,
    );
    expect(screen.getByTestId('t02-container')).toBeInTheDocument();
  });
});
