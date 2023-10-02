import React from 'react';
import {render, screen} from '@testing-library/react';
import T09EContainer from '../T09EContainer';

jest.mock('../../../application', () => ({
  useCalculationsT09E: () => ({
    dRho: jest.fn().mockReturnValue(1),
    calcXtQ0Flux: jest.fn().mockReturnValue([1, 2]),
    calcXtQ0Head: jest.fn().mockReturnValue([3, 4, true, true]),
    calculateDiagramData: jest.fn().mockReturnValue([
      {xt: 5, z0: 6, z0_new: 7},
      {xt: 8, z0: 9, z0_new: 10},
      {xt: 11, z0: 12, z0_new: 13},
    ]),
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

describe('T09EContainer Tests', () => {
  test('It renders the component', async () => {
    render(<T09EContainer/>);
    expect(screen.getByTestId('t09e-container')).toBeInTheDocument();
  });
});
