import React from 'react';
import {render, screen} from '@testing-library/react';
import T09DContainer from '../T09DContainer';

jest.mock('../../../application', () => ({
  useCalculationsT09D: () => ({
    dRo: jest.fn().mockReturnValue(1),
    calcXt: jest.fn().mockReturnValue(1),
    calculateZCrit: jest.fn().mockReturnValue(1),
    calculateQCrit: jest.fn().mockReturnValue(1),
    calcLambda: jest.fn().mockReturnValue(1),
    calcMu: jest.fn().mockReturnValue(1),
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
      <T09DContainer/>,
    );
    expect(screen.getByTestId('t09d-container')).toBeInTheDocument();
  });
});
