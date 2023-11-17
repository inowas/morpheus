import React from 'react';
import {render, screen} from '@testing-library/react';
import T08Container from './T08Container';

jest.mock('../../application', () => ({
  useCalculate: () => ({
    calcC: jest.fn().mockReturnValue(1),
    calcCTau: jest.fn().mockReturnValue(1),
    calculateVx: jest.fn().mockReturnValue(1),
    calculateDL: jest.fn().mockReturnValue(1),
    calculateR: jest.fn().mockReturnValue(1),
    calculateDiagramData: jest.fn().mockReturnValue(1),
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
      <T08Container/>,
    );
    expect(screen.getByTestId('t08-container')).toBeInTheDocument();
  });

});
