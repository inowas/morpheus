import {render, screen} from '@testing-library/react';

import React from 'react';
import T09FContainer from '../T09FContainer';

jest.mock('../../../application', () => ({
  useCalculationsT09F: () => ({
    dRho: jest.fn().mockReturnValue(1),
    calcXt: jest.fn().mockReturnValue(2),
    calcDeltaXt: jest.fn().mockReturnValue(3),
    calcNewXt: jest.fn().mockReturnValue(4),
    calcH: jest.fn().mockReturnValue(4),
    calcI: jest.fn().mockReturnValue(4),
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

describe('T09EContainer Tests', () => {
  test('It renders the component', async () => {
    render(<T09FContainer/>);
    expect(screen.getByTestId('t09f-container')).toBeInTheDocument();
  });
});
